	var USERNAME = "miniproject";
	var PASSWORD = "Pr!nt123";
	var currentItem = null;
	var order = {
    "partnerOrderReference": "MyReferenceNumber",
    "orderCustomer": {  
        "firstName": "John",  
        "lastName": "Doe",  
        "companyName": "ACME",  
        "address1": "1 Acme Way",  
        "address2": "",  
        "city": "Livingston",  
        "state": "MT",  
        "postalCode": "59047",  
        "countryCode": "US",  
        "email": "jdoe@acme.com",  
        "phone": "1234567890"  
    },  
    "items": [  
        {  
            "itemSequenceNumber": 1,  
            "productID": 1234,  
            "quantity": 1000,   
            "templateData": [
                {
                    "templateDataName": "CompanyName",
                    "templateDataValue": "Colorful Baloons Ltd."
                },
                {
                    "templateDataName": "PhoneNumber",
                    "templateDataValue": "800.223.7722"
                },
                {
                    "templateDataName": "TagLine",
                    "templateDataValue": "Blowing in the wind."
                }
            ]
        }
    ],  
    "shipments": [  
        {  
            "shipmentSequenceNumber": 1,  
            "firstName": "John",  
            "lastName": "Doe",  
            "companyName": "ACME",  
            "address1": "1 Acme Way",  
            "address2": "",  
            "city": "Livingston",  
            "state": "MT",  
            "postalCode": "59047",  
            "countryCode": "US",  
            "phone": "1234567890",  
            "shippingMethod": "FDXG"   
        }  
    ]  
}


$( document ).ready(function() {
	var credentials = "miniproject:Pr!nt123";
	var base64Credentials = btoa(credentials);    
	console.log(base64Credentials);
	console.log(credentials);
	$.ajax
	({
	  type: "GET",
	//  crossDomain: true,
      dataType: 'json',
      contentType: 'json',
	  url: "/products.php",
	  headers: {
	    "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
	  },
	  success: function (res){
	    console.log(res);
	    console.log(JSON.stringify(res.results.data));

	    var source   = $("#products_template").html();
		var template = Handlebars.compile(source);
		var context = res.results.data;
		var html    = template({products:res.results.data});
		$("#results").html(html);
		$("tr:not(:first-child)").click(getProduct);
		console.log(html);
	  }
	});

});

function getProduct(){
	var productID = $(this).children().first().html();
	console.log(productID);
	currentItem = productID;
	console.log($(this).children().filter(".productID"));
	var productURL = "/product.php?productID="+productID;
	$.ajax
	({
	  type: "GET",
	  //crossDomain: true,
      dataType: 'json',
      contentType: 'json',
	  url: productURL,
	  headers: {
	    "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
	  },
	  success: function (res){
	    console.log(res);
	    var context = "";
	    var source   = $("#product_template").html();
	    console.log(source);
		var template = Handlebars.compile(source);
		console.log(template);
	    if(res.results.data.templateFields) {
		    console.log(JSON.stringify(res.results.data.templateFields.fieldlist));
			context = res.results.data.templateFields.fieldlist.field;
			console.log(context);
		}
		var html    = template({"field": context});
		$("#productDetails").html(html);
		$("#myModal").modal('show');
		//$("tr:not(:first-child)").click(getProduct);
		console.log(html);
	  }
	});
}

function submitOrder() {
	order.items = [];
	var templateData = [];
	var $formData = $(".templateData");
	$(".templateData").each(function(){
		templateData.push({"templateDataName": this.name, "templateDataValue": $(this).val()})
	});
	console.log(templateData);
	order.items.push({
		"itemSequenceNumber": 1,  
        "productID": currentItem,  
        "quantity": 1000,   
        "templateData": templateData
    }
	);
	console.log(order.items);
        $("#productDetails").html("Please wait your order is being processed. Thank you!");
	$.post('/placeOrder.php',order,function (res){
        
        var res=JSON.parse(res);
        console.log(res);
	var orderNumber = res.results.data.orderNumber;
        var html = "Congratulations! Your order number is: "+orderNumber;    
        $("#productDetails").html(html);
	});
}			