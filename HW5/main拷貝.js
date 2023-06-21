$(document).ready(function(){
    //do something
    $("#thisButton").click(function(){
        processImage();
    });
});

function processImage() {
    
    //確認區域與所選擇的相同或使用客製化端點網址
    var url = "https://eastus.api.cognitive.microsoft.com/";
    var uriBase = url + "vision/v2.1/analyze";
    
    var params = {
        "visualFeatures": "Description,Objects",
        "details": "Landmarks",
        "language": "en",
    };
    //顯示分析的圖片
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;
    //送出分析
    $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request header
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        // Request body
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    .done(function(data) {
        //顯示JSON內容
        $("#responseTextArea").val(JSON.stringify(data, null, 2));

        //先清空
        $("#picDescription").empty();
        
        //先看有沒有一句話描述，有就說「可能是...」，沒有就説「不好説...」
        //跟程式碼後六行註解意思一樣，但註解所跑出來的結果<br>沒有換行效果，所以直接用chatgpt改成下面三行
        $("#picDescription").text(data.description.captions && data.description.captions.length > 0
        ? "It might be " + data.description.captions[0].text + "!"
        : "It's hard to describe this picture in one sentence!");
        // $("#picDescription").text();
        // if (data.description.captions && data.description.captions.length > 0) {
        //     $("#picDescription").text("It might be " + data.description.captions[0].text + "<br>")
        // } else {
        //     $("#picDescription").text("It's hard to describe this picture in one sentence!" + "<br>")
        // };
        
        //觀察後發現「object」都會出現正確答案
        //用if判斷objects是否為空，若否則輸出項目0
        //有多個項目則進入for迴圈
        if (data.objects && data.objects.length > 0) {
        $("#picDescription").append("<br>" + "it might be a " + data.objects[0].object )    
            for (var x = 1; x < data.objects.length; x++) {
                $("#picDescription").append("<br>" + "or a " + data.objects[x].object);
            }
        $("#picDescription").append("!")    
        }

        // if (data.objects && data.objects.length > 0) {
        // $("#picDescription").append("<br>" + "it might be a " + data.objects[0].object )    
        //     for (var x = 1; x < data.objects.length; x++) {
        //         $("#picDescription").append("<br>" + "or a " + data.objects[x].object);
        //     }
        // $("#picDescription").append("!")    
        // }




        // $("#picDescription").append("<br>" + data.objects[0].object);
    
        // for (var x = 0; x < data.objects.[0].length;x++){
        //     $("#picDescription").append(data.description.captions[x].text + "<br>");
        // }
        // // $("#picDescription").append("這裡有"+data.faces.length+"個人");
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        //丟出錯誤訊息
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
};
