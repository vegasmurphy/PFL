<?PHP

$username = "miniproject";
$password = "Pr!nt123";
$url = 'https://testapi.pfl.com/orders?apikey=136085';



$dataInput = (file_get_contents("php://input"));
$data = array("name" => "Hagrid", "age" => "36");                                                                    
$data_string = json_encode($_POST);                                                                                   
                                                                                                                     
$ch = curl_init($url);                                                                      
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);                                                                      
curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
    'Content-Type: application/json',                                                                                
    'Content-Length: ' . strlen($data_string))                                                                       
);  
$result=curl_exec($ch);
// Closing
curl_close($ch);
// Will dump a beauty json :3
echo($result);

?>	