export class autosaveNotify{
    constructor(){
        $("body").append(`
<div class="modal fade modal-autosave" tabindex="-1" role="dialog" style="display: block; padding-right: 15px;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
        
        <div class="modal-body">
            <p>Autosaving...</p>
        </div>
        </div>
    </div>
</div>
    `)
    }

    show(){
        $('body').addClass("autosave-open");
        $('.modal-autosave').modal({backdrop:false});
        this.hide();
    }
    hide(){
        setTimeout(function(){
            $('.modal-autosave').modal('hide');
        },2000)
        setTimeout(function(){
            $('body').removeClass("autosave-open");
        },2400)
    }

}