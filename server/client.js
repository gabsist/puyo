var socket = io.connect('http://localhost:8080');
var timer;

$(document).ready(function() {
  $('#text').keydown(function(event) {
    // �G���^�[�L�[�Ŕ������T�[�o�ɑ��M����
    if (event.keyCode === 13) {
      // �C�x���g��'all'�Ń��b�Z�[�W���T�[�o�ɑ��M����
      socket.emit('all', {
        action: 'post',
        user: $('#user').val(),
        css: $('#css').val(),
        text: $('#text').val()
      });

    // �^�C�s���O���Ƃ����X�e�[�^�X���T�[�o�ɑ��M����
    } else {
      // �C�x���g��'others'�Ń��b�Z�[�W���T�[�o�ɑ��M����
      socket.emit('others', {
        action: 'typing',
        user: $('#user').val()
      });
    }
  });

  // �T�[�o����̃C�x���g'msg'����M����
  socket.on('msg', function(data) {
    switch (data.action) {
      case 'post': // �����̕`��
        $('<li></li>').text(data.user + ': ' + data.text)
                      .attr('style', data.css)
                      .appendTo('body');
        break;
      case 'typing': // �^�C�s���O���X�e�[�^�X�̕`��
        $('#typing').text(data.user + '���񂪃^�C�s���O���ł�...');
        clearTimeout(timer);
        timer = setTimeout(function() { $('#typing').empty(); }, 3000);
        break;
    }
  });
});