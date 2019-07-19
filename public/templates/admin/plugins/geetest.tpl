<div class="row">
    <div class="col">
        <div class="panel panel-default">
        <form role="form" class="greetest-settings">
            <div class="panel-heading">Math Captcha Failures Report</div>
            <div class="panel-body">

                           <div class="checkbox">
                             <label>
                               <input data-toggle-target="#geetestHttps" type="checkbox" id="geetestEnabled" name="geetestEnabled"/> Enable Geetest
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

            </div>
                             </form>
        </div>
    </div>
</div>
