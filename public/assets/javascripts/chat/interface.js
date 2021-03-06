Chat.Interface = function() {
  var socket = Chat.Config.socket;
  var $chat = $(Chat.Config.chatDivSelector);
  var $messagesContainer = $chat.find('.messages-container');
  var $inputContainer = $chat.find('.input-container');
  var $inputPrompt = $chat.find('#chat-prompt');
  var $input = $(Chat.Config.chatTextSelector);
  var sender = new Chat.Sender();

  var chatTimeout;

  this.init = function() {
    bindEvents();
  };

  this.renderChatItem = function(alias, message) {
    var $chatItem = $('<div class="container"><div class="chat-item"><span class="alias">' + alias + ':</span> <span class="message">' + message + '</span></div></div>').hide();
    clearInterval(chatTimeout);
    $messagesContainer.stop().animate({ opacity: 1 }, 400).show();
    $chatItem.appendTo($messagesContainer).slideDown(function() {
      $chatItem.find('.chat-item').css('opacity', 1);
      var timeoutLength = message.length * 100; // longer messages have more time before they disappear
      chatTimeout = setTimeout(closeChat, 3000 + timeoutLength);
    });
  };

  // private methods

  var bindEvents = function() {
    $(document).keypress(function(e) {
      switch(e.keyCode) {
        case 13: // enter for messages
          e.preventDefault();
          renderInputBox({ prompt: 'message', callback: sender.sendMessage });
          break;
        case 47: // '/' - forwardslash for commands (alias)
          e.preventDefault();
          renderInputBox({ prompt: 'command', callback: sender.sendCommand });
          break;
      }
    });
  };

  var renderInputBox = function(args) {
    var prompt = args.prompt;
    var callback = args.callback;
    $inputPrompt.html(prompt);
    $inputContainer.slideDown(100, function() {
      $input.focus();
    });
    $input.keypress(function(e) { onEnter(e, callback); });
  };

  var closeChat = function() {
    $messagesContainer.fadeOut(2000, function() {
      if(!$messagesContainer.is(':visible')) { $messagesContainer.html(''); };
    });
  };

  var onEnter = function(e, callback) {
    if(e.keyCode === 13) {
      e.stopPropagation();
      callback();
      resetInput();
      $inputContainer.slideUp(400);
    }
  };

  var resetInput = function() {
    $input.off();
    $input.html('');
    $input.blur();
  };

  this.init();
};
