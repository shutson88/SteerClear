//
//  ViewController.swift
//  stearClear
//
//  Created by Noor Thabit on 10/4/15.
//  Copyright © 2015 4H. All rights reserved.
//

import UIKit

class LoginViewController: UIViewController {
    
    @IBOutlet weak var usernameTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var singInButton: UIButton!
    
    let url = NSURL(string: "http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/api/authenticate")
    
    var user: User!
    var JSONData: Dictionary<String, AnyObject>!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        JSONData = Dictionary<String, AnyObject>()
        user = User()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        let dashboard: UserViewController = segue.destinationViewController as! UserViewController
        dashboard.user = user
        
    }
    
    @IBAction func singIn(sender: AnyObject) {
        autenticate()
        
    }
    
    func unwrapStr(dic: Dictionary<String, AnyObject>, key: String) -> String{
        guard let info = dic[key]! as? String else{
            print("could not unwrap " + key)
            return ""
        }
        return info
    }
    
    func unwrapInt(dic: Dictionary<String, AnyObject>, key: String) -> Int{
        let str:String = String(dic[key]!)
        return Int(str)!
        
    }
    
    
    func getToken(){
        user.token = unwrapStr(self.JSONData, key: "token")
    }
    
    func autenticate(){
        let cachePolicy = NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData
        let request = NSMutableURLRequest(URL: url!, cachePolicy: cachePolicy, timeoutInterval: 10.0)
        request.HTTPMethod = "POST"
        request.addValue("application/x-www-form-urlencoded", forHTTPHeaderField:"Content-Type")
        
        let loginCredentials = "username=\(usernameTextField.text!)&password=\(passwordTextField.text!)";
        
        request.HTTPBody = loginCredentials.dataUsingEncoding(NSUTF8StringEncoding);
        
        let task = NSURLSession.sharedSession().dataTaskWithRequest(request) {
            data, response, error in
            // You can print out response object
            print("response = \(response)")
            
            // Print out response body
            //let responseString = NSString(data: data!, encoding: NSUTF8StringEncoding)
            let myJSON = try! NSJSONSerialization.JSONObjectWithData(data!, options: .MutableLeaves) as? Dictionary<String, AnyObject>
            
            if let parseJSON = myJSON {
                // Now we can access value of First Name y its key
                let status = parseJSON["success"] as! Bool
                print("Success: \(status)")
                if (status == false) {
                    return
                }
                self.user.token = parseJSON["token"] as! String

            }
        }
        task.resume()
        return
    }
    
}

