import { Worker, MultiWorker, Scheduler, Queue } from "node-resque";
import * as debugFactory from 'debug';

const _ = require('lodash');
const _secrets = require('../secrets.json');
const debug = debugFactory('feed-queue');

const _workerJobs = {
  addFrame: {
    perform: async ops => {
      debug('in addFrame::perform', ops);
      await new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });
      debug('half-way done with frame processing');
      await new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });
      debug('about to finish perform func', ops);
      return {
        asyncProcessed: true,
        data: 'some data in string form',
        success: true
      };
    }
  }
};

const QUEUE_NAME = 'feeds';

/**
 * Encapsulates a named feed processing queue
 */
export class FeedQueueManager {
  
  private namespace: string;
  private scheduler: Scheduler;
  private worker: MultiWorker;
  private queue: Queue;

  /**
   * Creates a new FeedQueueManager instance
   * @param {string} ns Queue Namespace used to distinguish itself from other queues.
   */
  constructor(ns: string = undefined) {
    this.namespace = ns;
    this.worker = this.workerFactory();    
    this.scheduler = this.schedulerFactory();
    this.queue = this.queueFactory();
  }

  /**
   * Starts the feed queue 
   */
  public async start() {
    // Can we check to make sure we aren't already started?

    // First, start our worker...
    this.worker.start();
    // Then spin up the sheduler
    await this.scheduler.connect();
    this.scheduler.start();
    await this.queue.connect();
  }
  /**
   * Stops the feed queue
   */
  public async stop() {
    await this.queue.end()
    await this.scheduler.end()
    await this.worker.end()
  }
  /**
   * Adds a frame for processing
   * @param {any} frameData The frame to add
   */
  public async addFrame(frameData: any) {
    return await this.queue.enqueue(QUEUE_NAME, "addFrame", frameData);
  }


  /**
   * Creates internal factory instance.
   * @returns {Scheduler}
   */
  private schedulerFactory() {
    if (this.scheduler) {
      return this.scheduler;
    }
    var scheduler = new Scheduler({ connection: this.connectionOptionsFactory() });
    scheduler.on("start", () => {
      debug("scheduler started");
    });
    scheduler.on("end", () => {
      debug("scheduler ended");
    });
    scheduler.on("poll", () => {
      debug("scheduler polling");
    });
    scheduler.on("leader", () => {
      debug("scheduler became leader");
    });
    scheduler.on("error", (error) => {
      debug(`scheduler error >> ${error}`, error);
    });
    scheduler.on("cleanStuckWorker", (workerName, errorPayload, delta) => {
      debug(
        `failing ${workerName} (stuck for ${delta}s) and failing job ${errorPayload}`
      );
    });
    scheduler.on("workingTimestamp", (timestamp) => {
      debug(`scheduler working timestamp ${timestamp}`);
    });
    scheduler.on("transferredJob", (timestamp, job) => {
      debug(`scheduler enquing job ${timestamp} >> ${JSON.stringify(job)}`);
    });
    return scheduler;
  }
  /**
   * Creates internal worker instance.
   * @returns {MultiWorker}
  */
  private workerFactory() {
    const worker = new MultiWorker({
      connection: this.connectionOptionsFactory(),
      queues: [QUEUE_NAME],
      minTaskProcessors: 1,
      maxTaskProcessors: 100,
      checkTimeout: 1000,
      maxEventLoopDelay: 10
    }, _workerJobs);
    worker.on("start", () => {
      debug("worker started");
    });
    worker.on("end", () => {
      debug("worker ended");
    });
    worker.on("cleaning_worker", (worker, pid) => {
      debug(`cleaning old worker ${worker}`);
    });
    worker.on("poll", (queue) => {
      debug(`worker polling ${queue}`);
    });
    worker.on("ping", (time) => {
      debug(`worker check in @ ${time}`);
    });
    worker.on("job", (queue, job) => {
      debug(`working job ${queue} ${JSON.stringify(job)}`);
    });
    worker.on("reEnqueue", (queue, job, plugin) => {
      debug(`reEnqueue job (${plugin}) ${queue} ${JSON.stringify(job)}`);
    });
    worker.on("success", (queue, job, result, duration) => {
      debug(
        `job success queue=${queue} job=${JSON.stringify(job)} result=${JSON.stringify(result)} duration==(${JSON.stringify(duration)}ms) args=${JSON.stringify(arguments)}   `
      );
    });
    worker.on("failure", (queue, job, failure, duration) => {
      debug(
        `job failure ${queue} ${JSON.stringify(
          job
        )} >> ${failure} (${duration}ms)`
      );
    });
    worker.on("error", (error, queue, job) => {
      debug(`error ${queue} ${JSON.stringify(job)}  >> ${error}`);
    });
    worker.on("pause", () => {
      debug("worker paused");
    });

    return worker;
 }
  /**
  * Creates internal Queue instance
  * @returns {Queue}
  */
  private queueFactory() {
    const queue = new Queue({ connection: this.connectionOptionsFactory() }, _workerJobs);
    return queue;
  }
  /** 
   *  Returns an initialized connections options object.
   * @returns {any} Connection options*/
  private connectionOptionsFactory() {
    const connectionOps = {
      pkg: 'ioredis',
      host: _secrets.resque.host || '127.0.0.1',
      port: _secrets.resque.port || 6379,
      database: _secrets.resque.database || 0,      
      looping: true
    } as any;
    if (this.namespace) {
      connectionOps.namespace = this.namespace;
    }
    if (_secrets.resque.password) {
      connectionOps.password = _secrets.resque.password;
      connectionOps.options = { password: _secrets.resque.password };
    }
    return connectionOps;
  }
}

const globalFeedQueue = new FeedQueueManager();

export async function startupQueue() {
  await globalFeedQueue.start();
}

export async function stopQueue() {
  await globalFeedQueue.stop();
}

export async function addFrame(frameData: any) {
  return await globalFeedQueue.addFrame(frameData);
}