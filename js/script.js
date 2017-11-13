$(function() {

  /* var to determine if user can double click or not */
  var dblClickMobile = screen.width > 900 ? 'dblclick' : 'click';

  function updateClock() {
    let time = new Date();
    let secsTillNextMin = 60 - time.getSeconds(); // for efficiency

    // update the text of our clock
    $("#time").text(
      ("0" + time.getHours()).slice(-2) + ":" +
      ("0" + time.getMinutes()).slice(-2));

    // setTimeout is more efficient than setInterval
    setTimeout(function() {
      updateClock()
    }, secsTillNextMin * 1000);
  }
  updateClock()


  /* NOTE: remake these with jQuery */

  function dragStart(event) {
  	var eleWidth = $(event.target).width();
  	var clickX = (event.pageX - $(event.target).offset().left) + $(window).scrollLeft();
  	var clickY = (event.pageY - $(event.target).offset().top) + $(window).scrollTop();

  	/* check if the click was located in the blue stripe */
  	if (4 < clickX && clickX < eleWidth - 4 && 4 < clickY && clickY < 24) {
  		var style = window.getComputedStyle(event.target, null);
  		event.dataTransfer.setData("text/plain", (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY) + ',' + event.target.getAttribute('data-item'));
      $(event.target).css({'zIndex': zIndex})
      zIndex++;
  	} else {
      /* prevent dragging */
  		event.preventDefault ? event.preventDefault() : event.returnValue = false
  	}
  }

  function dragOver(event) {
  	event.preventDefault();
  	return false;
  }

  function drop(event) {
  	var offset = event.dataTransfer.getData("text/plain").split(',');
  	var dm = document.getElementsByClassName('drag');
  	dm[parseInt(offset[2])].style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
  	dm[parseInt(offset[2])].style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
  	event.preventDefault();
  	return false;
  }

  var dm = document.getElementsByClassName('drag');
  for (var i = 0; i < dm.length; i++) {
  	dm[i].addEventListener('dragstart', dragStart, false);
  }
  document.body.addEventListener('dragover', dragOver, false);
  document.body.addEventListener('drop', drop, false);


  function prepareForSelection(id, img) {
    $(id).on("click", function() {
      $(id).attr("src", img.selected)

      // make the adjancent <p> look selected
      $(id).next().addClass("selected")

      // can't fire this safely without timeout
      setTimeout(function() {
        prepareForDeselection(id, img)
      }, 100)

      $(id).off("click")
    })
  }

  function prepareForDeselection(id, img) {
    $("body").on("click", function() {
      $(id).attr("src", img.default)
      $(id).next().removeClass("selected")

      setTimeout(function() {
        prepareForSelection(id, img)
      }, 100)

      $("body").off("click")
    })
  }

  prepareForSelection("#my-computer", {
    default: 'images/my-computer.jpg',
    selected: 'images/my-computer-selected.jpg'
  })

  prepareForSelection("#trash", {
    default: 'images/trash.jpg',
    selected: 'images/trash-selected.jpg'
  })

  prepareForSelection("#readme", {
    default: 'images/text-file.png',
    selected: 'images/text-file-selected.png'
  })

  prepareForSelection("#resume", {
    default: 'images/resume.png',
    selected: 'images/resume-selected.png'
  })

  prepareForSelection("#projects", {
    default: 'images/folder.png',
    selected: 'images/folder-selected.jpg'
  })

  var projectLinks = ['#link-abra', '#link-ceramics', '#link-patterns', '#link-exercism', '#link-cubes'];
  for (var i = 0; i < projectLinks.length; i++) {
    prepareForSelection(projectLinks[i], {
      default: 'images/link.png',
      selected: 'images/link-selected.png'
    })
  }

  /* used to keep most recently clicked window on top */
  let zIndex = 1;

  $(".window").on("click", function() {
    $(this).css({'zIndex': zIndex})
    zIndex++;
  })

  function openErrorWindow(filename) {
    $("#error-title").text(filename)
    $("#error-text").text(filename + " is not accessible")
    $("#error").show()
    zIndex++;
  }

  $("#my-computer").on(dblClickMobile, function(event) {
    $("#error").css({
      'top': event.clientY,
      'left': event.clientX + 60,
      'zIndex': zIndex
    })
    openErrorWindow("My Computer")
  })

  $("#trash").on(dblClickMobile, function(event) {
    $("#error").css({
      'top': event.clientY,
      'left': event.clientX + 60,
      'zIndex': zIndex
    })
    openErrorWindow("Recycle Bin")
  })

  $("#start-button").on("click", function() {
    $("#error").css({
      'top': 'auto',
      'bottom': 32,
      'left': 0,
      'zIndex': zIndex
    })
    openErrorWindow("Start")
  })

  $("#error-x-button").on("click", function() {
    $("#error").hide()
  })

  $("#cancel").on("click", function() {
    $("#error").hide()
  })

  $("#retry").on("click", function() {
    $("#error").hide()
    setTimeout(function() {
      $("#error").show()
    }, 250)
  })


  $("#readme").on(dblClickMobile, function() {
    $("#readme-document").css({
      'top': event.clientY,
      'left': event.clientX + 60,
      'zIndex': zIndex
    })
    $("#readme-document").show()
    zIndex++;
  })

  $("#readme-x-button").on("click", function() {
    $("#readme-document").hide()
  })

  $("#projects").on(dblClickMobile, function() {
    $("#projects-folder").css({
      'top': 'auto',
      'left': event.clientX + 60,
      'bottom': event.clientX,
      'zIndex': zIndex
    })
    console.log(event.clientY)
    $("#projects-folder").show()
    zIndex++;
  })

  $("#projects-x-button").on("click", function() {
    $("#projects-folder").hide()
  })

  /*
  $("#link-abra").on(dblClickMobile, function() {
      window.open('abra.jacobjanak.com', '_blank');
  })
  */

  $("#link-ceramics").on(dblClickMobile, function() {
      window.open('https://www.monikavitekceramics.herokuapp.com', '_blank');
  })

  $("#startup-sound").get(0).play();

})
