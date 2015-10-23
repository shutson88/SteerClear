//
//  ViewController.swift
//  stearClear
//
//  Created by Noor Thabit on 10/4/15.
//  Copyright © 2015 4H. All rights reserved.
//

import Alamofire
import UIKit

class LoginViewController: UIViewController {
    
    @IBOutlet weak var next = UIBarButtonItem()
    @IBOutlet weak var usernameTextField = UITextField()
    @IBOutlet weak var passwordTextField = UITextField()
    @IBOutlet weak var singInButton = UIButton()
    
    let url = NSURL(string: "http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/api/authenticate")
    
    var user: User = User()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
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

        user.username = usernameTextField!.text
        autenticate()
    }
  

    
    func autenticate(){
        let parameters = [
            "username":"\(usernameTextField!.text!)",
            "password":"\(passwordTextField!.text!)"
        ]
        
        let url = "http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/api/authenticate"
        Alamofire.request(.POST, url, parameters: parameters) .responseJSON { response in
            print(response.result)   // result of response serialization
            
            if let JSON = response.result.value {
                print(JSON)
                self.user.token = String(JSON["token"]!!)
                self.performSegueWithIdentifier("dashboard", sender: self)


            }
        }
    }
}

