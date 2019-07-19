        <form role="form" class="geetest-settings">
<div class="row">
    <div class="col">
        <div class="panel panel-default">
            <div class="panel-heading">Geetest Settings</div>
            <div class="panel-body">
                           <div class="checkbox">
                             <label>
                               <input data-toggle-target="#geetestEnabled" type="checkbox" id="geetestEnabled" name="geetestEnabled"/> Enable Geetest
                             </label>
                           </div>
                           <p class="help-block">To check every user registration. You need a private and a public key, get yours from
                             <a target="_blank" href="https://auth.geetest.com/login/">geetest.com/auth</a></p>
                             <div class="form-inline">
                               <div class="form-group" style="width:45%;">
                                 <label for="recaptchaPublicKey">公钥（id）</label>
                                 <input placeholder="Public id Key here" type="text" class="geetestId form-control" id="geetestId" name="geetestId"/>
                               </div>
                               <div class="form-group" style="width:45%;">
                                 <label for="recaptchaPrivateKey">私钥（key）</label>
                                 <input placeholder="Private (Secret) API Key here" type="text" class="geetestKey form-control" id="geetestKey" name="geetestKey"/>
                               </div>
                             </div>
                             <p class="help-block">Keep your private key private</p>

                   <button class="btn btn-lg btn-primary" id="save" type="button">Save</button>
            </div>
        </div>
    </div>
</div>
                             </form>

<script type="text/javascript">
          require(['settings'], function(Settings) {
            var nbbId = 'geetest',
            klass = nbbId + '-settings',
            wrapper = $( '.' + klass );

            function onChange (e) {
              var target = $(e.target);
              var input = wrapper.find(target.attr('data-toggle-target'));
              if (target.is(':checked')) {
                input.prop('disabled', false);
              } else {
                input.prop('disabled', true);
              }
            }

            wrapper.find('input[type="checkbox"]').on('change', onChange);

            Settings.load(nbbId, wrapper, function() {
              wrapper.find('input[type="checkbox"]').each(function() {
                onChange({target: this});
              });
            });

            wrapper.find('#save').on('click', function(e) {
              e.preventDefault();
              wrapper.find('.form-group').removeClass('has-error');

              var invalidSelector = '';
              var invalidCount = 0;
              wrapper.find('input[type="checkbox"]').each(function(i, checkbox) {
                checkbox = $(checkbox);
                if (checkbox.is(':checked') && !wrapper.find(checkbox.attr('data-toggle-target')).val()) {
                  invalidSelector += (!invalidCount++ ? '' : ', ') + checkbox.attr('data-toggle-target');
                }
              });

              if (invalidSelector) {
                wrapper.find(invalidSelector).each(function(i, el) {
                  el = $(el);
                  el.parents('.form-group').addClass('has-error');
                });
              } else {
                Settings.save(nbbId, wrapper, function() {
                  app.alert({
                    type: 'success',
                    alert_id: nbbId,
                    title: 'Reload Required',
                    message: 'Please reload your NodeBB to have your changes take effect',
                    clickfn: function() {
                      socket.emit('admin.reload');
                    }
                  });
                });
              }
            });
          });
      </script>
