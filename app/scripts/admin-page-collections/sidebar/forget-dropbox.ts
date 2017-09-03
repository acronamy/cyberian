export async function forgetDropbox(){
    
    var id = $(this).data("id");
    var filename = $(this).data("name");

    //set headers issue, perhaps stager the delete action await complete the psuod sequential next
    
    $.post("/delete/dropbox-photo",{filename:filename},(res)=>{
        if(res){
            $(this).removeClass("saved");
            $(this).find(".download").removeClass("hide");
            $(this).find(".local-copy").addClass("hide");
            localStorage.removeItem(id+"_saved");
            console.log(filename,"deleted!")
        }
        else{

        }
    })
    .fail(function(){

    })

}