'use strict';

function save_options() {
  var status;

  localStorage["videotron_user_id"] = $("#videotronUserId").val();

  status = $("#status");
  status.text("Options Saved.");
  setTimeout(function() {
    status.text("");
  }, 750);
}

function restore_options() {
  var videotronUserId = localStorage["videotron_user_id"]
  if(videotronUserId) {
    $("#videotronUserId").val(videotronUserId)
  }
}

$(function() {
  restore_options();
  $('#saveBtn').on('click', save_options);
})

