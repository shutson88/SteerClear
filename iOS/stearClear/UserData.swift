//
//  UserData.swift
//  stearClear
//
//  Created by Noor Thabit on 10/4/15.
//  Copyright © 2015 4H. All rights reserved.
//

import Foundation

class User{
    
    
    var username: String!
    var password: String!
    
    var message: String!
    
   
    
    var dataDic: Dictionary<String, AnyObject>!
    

    
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
    
    func fetchJSON(JsonURL: String){
        let data: NSData = NSData(contentsOfURL: NSURL(string: JsonURL)!)!
        dataDic = try! NSJSONSerialization.JSONObjectWithData(data, options: NSJSONReadingOptions.MutableContainers) as! Dictionary<String, AnyObject>
    }
    
    func parse(){
        
        self.message = unwrapStr(dataDic, key: "message")
        
        
    }
    
    init(username: String, password: String){
        
        self.username = username;
        self.password = password;
      
        //fetchJSON(JsonURL)
        parse()

    }
    

    func post(params : Dictionary<String, String>, url : String) {
        let request = NSMutableURLRequest(URL: NSURL(string: url)!)
        let session = NSURLSession.sharedSession()
        request.HTTPMethod = "POST"
        
        do {
            request.HTTPBody = try NSJSONSerialization.dataWithJSONObject(params, options: .PrettyPrinted)
        } catch {
            //handle error. Probably return or mark function as throws
            print(error)
            return
        }
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        
        let task = session.dataTaskWithRequest(request, completionHandler: {data, response, error -> Void in
            // handle error
            guard error == nil else { return }
            
            print("Response: \(response)")
            let strData = NSString(data: data!, encoding: NSUTF8StringEncoding)
            print("Body: \(strData)")
            
            let json: NSDictionary?
            do {
                json = try NSJSONSerialization.JSONObjectWithData(data!, options: .MutableLeaves) as? NSDictionary
            } catch let dataError {
                // Did the JSONObjectWithData constructor return an error? If so, log the error to the console
                print(dataError)
                let jsonStr = NSString(data: data!, encoding: NSUTF8StringEncoding)
                print("Error could not parse JSON: '\(jsonStr)'")
                // return or throw?
                return
            }
            
            
            // The JSONObjectWithData constructor didn't return an error. But, we should still
            // check and make sure that json has a value using optional binding.
            if let parseJSON = json {
                // Okay, the parsedJSON is here, let's get the value for 'success' out of it
                let success = parseJSON["success"] as? Int
                print("Succes: \(success)")
            }
            else {
                // Woa, okay the json object was nil, something went worng. Maybe the server isn't running?
                let jsonStr = NSString(data: data!, encoding: NSUTF8StringEncoding)
                print("Error could not parse JSON: \(jsonStr)")
            }
            
        })
        
        task.resume()
    }
    
    
    
}
