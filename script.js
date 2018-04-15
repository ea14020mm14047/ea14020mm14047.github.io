recalculateServiceTime();
$('.priority-only').hide();

$(document).ready(function () {
  $('input[type=radio][name=algorithm]').change(function () {
    if (this.value == 'robin') {
      $('.servtime').hide();
      $('#quantumParagraph').show();
    }
    else {
      $('#quantumParagraph').hide();
      $('.servtime').show();
    }

    recalculateServiceTime();
  });
});

function addRow() {
  var lastRow = $('#inputTable tr:last');
  var lastRowNum = parseInt(lastRow.children()[1].innerText);
  var newRow = "";

  if ($('input[type=radio][name=algorithm]:checked').val() == 'fcfs') {
	  newRow = '<tr><td>P'
	  + (lastRowNum + 1)
	  + '</td><td>'
	  + (lastRowNum + 1)
	  + '</td><td><input class="exectime" type="text"/></td><td class="servtime"></td>';
  }
  else {
	  newRow = '<tr><td>P'
	  + (lastRowNum + 1)
	  + '</td><td>'
	  + (lastRowNum + 1)
	  + '</td><td><input class="exectime" type="text"/></td>';
  }


  lastRow.after(newRow);

  var minus = $('#minus');
  minus.show();


  $('#inputTable tr:last input').change(function () {
    recalculateServiceTime();
  });
}

function deleteRow() {
  var lastRow = $('#inputTable tr:last');
  lastRow.remove();

  var minus = $('#minus');

  if ($('#inputTable tr').length == 2)
    minus.hide();
}

$(".initial").change(function () {
  recalculateServiceTime();
});

function recalculateServiceTime() {
  var inputTable = $('#inputTable tr');
  var totalExectuteTime = 0;

  var algorithm = $('input[name=algorithm]:checked', '#algorithm').val();
  if (algorithm == "fcfs") {
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      $(value.children[3]).text(totalExectuteTime);

      var executeTime = parseInt($(value.children[2]).children().first().val());
      totalExectuteTime += executeTime;
    });
  }
  else if (algorithm == "robin") {
    $('#minus').css('left', '335px');
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      $(value.children[3]).text("");
    });
  }
}

function animate() {
	$('result').prepend('<div id="curtain" style="position: absolute; right: 0; width:100%; height:100px;"></div>');
  
  $('#curtain').width($('#resultTable').width());
  $('#curtain').css({left: $('#resultTable').position().left});
  
  var sum = 0;
  $('.exectime').each(function() {
      sum += Number($(this).val());
  });
  
  console.log($('#resultTable').width());
  var distance = $("#curtain").css("width");
  
  animationStep(sum, 0);
  jQuery('#curtain').animate({ width: '0', marginLeft: distance}, sum*1000/2, 'linear');
}

function animationStep(steps, cur) {
	$('#timer').html(cur);
	if(cur < steps) {
		setTimeout(function(){ 
   	     animationStep(steps, cur + 1);
  	}, 500);
  }
  else {
  }
}

$('.draw').click(function() {
	
});
function draw() {
  $('result').html('');
  var inputTable = $('#inputTable tr');
  var th = '';
  var td = '';

  var algorithm = $('input[name=algorithm]:checked', '#algorithm').val();
  if (algorithm == "fcfs") {
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[2]).children().first().val());
      th += '<th style="height: 60px; width: ' + executeTime * 20 + 'px;">P' + (key - 1) + '</th>';
      td += '<td>' + executeTime + '</td>';
    });

    $('result').html('<table id="resultTable"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  else if (algorithm == "robin") {
    var quantum = $('#quantum').val();
    var executeTimes = [];

    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[2]).children().first().val());
      executeTimes[key - 1] = { "executeTime": executeTime, "P": key - 1 };
    });

    var finished = false;
    while (!finished) {
      finished = true;
      $.each(executeTimes, function (key, value) {
        if (value.executeTime > 0) {
          th += '<th style="height: 60px; width: ' + (value.executeTime > quantum ? quantum : value.executeTime) * 20 + 'px;">P' + value.P + '</th>';
          td += '<td>' + (value.executeTime > quantum ? quantum : value.executeTime) + '</td>';
          value.executeTime -= quantum;
          finished = false;
        }
      });
    }
    $('result').html('<table id="resultTable" style="width: 70%"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  animate();
}