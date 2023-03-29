document.addEventListener('DOMContentLoaded', function() {
    var hideableInformation = document.querySelectorAll('.HideableInformation');
  
    hideableInformation.forEach(function(info) {
      info.style.display = 'none'; // hide the element by default
    });
  
    var shrinkBoxes = document.querySelectorAll('.ShrinkBox');
  
    shrinkBoxes.forEach(function(shrinkBox) {
      var arrow = shrinkBox.querySelector('.DownArrow');
      var hideableInformation = shrinkBox.querySelector('.HideableInformation');
  
      shrinkBox.addEventListener('click', function() {
        hideableInformation.style.display = (hideableInformation.style.display === 'block') ? 'none' : 'block';
        arrow.classList.toggle('RotatedArrow');
        });
    });
});
  