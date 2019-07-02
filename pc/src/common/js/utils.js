/**
 * @desc 函数节流
 * 适用于限制`resize`和`scroll`等函数的调用频率
 *
 * @param {Number} delay  0或者更大的毫秒数。对于事件回调，大约100或250毫秒（或者更高）
 * @param {Boolean} noTrailing 可选。默认为false。
 *                   如果noTrailing为true,当节流函数被调用，每过`delay`毫秒，`callback`也将执行一次。
 *                   如果noTrailing为false或未传入，`callback`将在最后一次调用节流函数后在执行一次。
 *                      （延迟`delay`毫秒之后，节流函数没有被调用，内部计数器也会复位）
 *
 * @param {Function} callback 延迟毫秒后执行的函数。`this`上下文和所有参数都是按原样传递的，执行去节流功能时，调用`callback`
 * @param {Boolean} debounceMode 如果`debounceMode`为true , `clear`在执行`delay`ms之后执行。
 *
 * @param {Function} 新的节流函数
 */
export function throttle(delay, noTrailing, callback, debounceMode) {
  /*
    After wrapper has stopped being called,the timeout ensures that `callback`
    is executed at the proper times in `throttle` and `end` debounce modes.
    */
  let timeoutID, lastExec

  // `noTrailing` defaults to falsy
  if (typeof noTrailing !== 'boolean') {
    debounceMode = callback
    callback = noTrailing
    noTrailing = undefined
  }

  /*
    The `wrapper` function encapsulates all of the throttling / debouncing functionality and 
    when executed will limit the rate at which `callback` is executed;
    */
  function wrapper() {
    let self = this
    let elapsed = Number(new Date()) - lastExec
    let args = arguments

    // Executed `callback` and update the `lastExec` timestamp.
    function exec() {
      lastExec = Number(new Date())
      callback.apply(self, args)
    }

    // if `debounceMode` is true (at begin) this is used to clear the flag to allow future `callback` executions.
    function clear() {
      timeoutID = undefined
    }

    if (debounceMode && !timeoutID) {
      // Since `wrapper` is being called for the first time and `debounceMode` is true (at begin) , execute `callback`.
      exec()
    } else if (noTrailing !== true) {
      /*
        In trailing throttle mode,since `delay` time has not been executed,schedule `callback` to 
        execute `delay` ms after most recent execution.

        if `debounceMode` is true (at begin),schedule `clear` to execute after `delay` ms.

        id `debounceMode` is false (at end) ,schedule `callback` to execute after `delay` ms. 
        */
      timeoutID = setTimeout(
        debounceMode ? clear : exec,
        debounceMode === undefined ? delay - elapsed : delay
      )
    }
  }
  // Return the wrapper function
  return wrapper
}
