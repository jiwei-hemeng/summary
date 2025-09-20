/**
 * 并发任务类
 */
class SuperTask {
  /**
   * @param {number} parallelConut - 并行数量
   */
  constructor(parallelConut = 2) {
    this.parallelConut = parallelConut;
    this.taskQueue = []; // 任务队列
    this.runningCount = 0; // 当前正在运行的任务数量
  }

  /**
   * 执行任务
   */

  run() {
    while (this.runningCount < this.parallelConut && this.taskQueue.length) {
      const task = this.taskQueue.shift();
      task().finally(() => {
        this.runningCount--;
        this.run();
      });
      this.runningCount++;
    }
  }

  /**
   * 添加任务
   * @param {Function} task - 任务函数，必须返回一个 Promise
   */
  addTask(task) {
    this.taskQueue.push(task);
    this.run();
  }
}

function timeout(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

const superTask = new SuperTask(2);
export default superTask;
function addTask(time, name) {
  superTask.addTask(() => {
    return timeout(time).then(() => {
      console.log(`任务 ${name} 结束`);
    });
  });
}
addTask(10000, "1"); // 10000 执行任务
addTask(5000, "2"); // 5000 执行任务
addTask(3000, "3"); // 8000 执行任务
addTask(4000, "4"); // 12000 执行任务
addTask(5000, "5"); // 15000 执行任务
addTask(6000, "6"); // 18000 执行任务
