//
//  AddAnimalViewController.swift
//  stearClear
//
//  Created by Noor Thabit on 10/24/15.
//  Copyright © 2015 4H. All rights reserved.
//

import UIKit
import Alamofire

class AddAnimalViewController: UIViewController {

    @IBOutlet weak var nameTextField: UITextField!
    
    @IBOutlet weak var breedTextField: UITextField!
    
    @IBOutlet weak var typeTextField: UITextField!
    
    @IBOutlet weak var addButton: UIButton!
    
    var token = String()
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    
    func addAnimal(){
        
        let parameters = [
            "name":"\(nameTextField!.text!)",
            "breed":"\(breedTextField!.text!)"
        ]
        
        let url = "http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/api/authenticate"
        
        Alamofire.request(.POST, url, parameters: parameters) .responseJSON { response in
            print(response.result)   // result of response serialization
            
            if let JSON = response.result.value {
                print(JSON)
                if String(JSON["success"]!!) == "1"{
                    self.token = String(JSON["token"]!!)
                    dispatch_async(dispatch_get_main_queue()){
                        
                        self.performSegueWithIdentifier("tableview dashboard", sender: self)
                        
                    }
                }
                else {
                    self.view.makeToast(message: "Wrong Username or Password!", duration: 1.0, position: "center")
                    return
                }
                //self.user.username = self.usernameTextField!.text
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
