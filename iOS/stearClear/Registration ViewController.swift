//
//  Registration ViewController.swift
//  stearClear
//
//  Created by Noor Thabit on 10/23/15.
//  Copyright © 2015 4H. All rights reserved.
//

import UIKit
import Alamofire

class RegistrationViewController: UIViewController {
   
    
    @IBOutlet weak var usernameTextField = UITextField()
    @IBOutlet weak var passwordTextField = UITextField()
    @IBOutlet weak var emailTextField = UITextField()
    @IBOutlet weak var creatAccountButton =  UIButton()

    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func signUp(){
        let parameters = [
            "username":"\(usernameTextField!.text!)",
            "password":"\(passwordTextField!.text!)"
        ]
        
        let url = "http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/api/authenticate"
        Alamofire.request(.POST, url, parameters: parameters) .responseJSON { response in
            print(response.result)   // result of response serialization
            
            if let JSON = response.result.value {
                print(JSON)
                self.performSegueWithIdentifier("signIn", sender: self)
                
            }
        }
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
