// 进入全屏
export function goToFullScreen(element) {
 element = element || document.body;
 if (element.requestFullscreen) {
   element.requestFullscreen();
 } else if (element.mozRequestFullScreen) {
   element.mozRequestFullScreen();
 } else if (element.msRequestFullscreen) {
   element.msRequestFullscreen();
 } else if (element.webkitRequestFullscreen) {
   element.webkitRequestFullScreen();
 }
};
// 退出全屏
export function goExitFullscreen() {
 if (document.exitFullscreen) {
   document.exitFullscreen();
 } else if (document.msExitFullscreen) {
   document.msExitFullscreen();
 } else if (document.mozCancelFullScreen) {
   document.mozCancelFullScreen();
 } else if (document.webkitExitFullscreen) {
   document.webkitExitFullscreen();
 }
};
