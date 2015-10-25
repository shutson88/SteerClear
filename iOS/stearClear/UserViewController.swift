//
//  UserViewController.swift
//  stearClear
//
//  Created by Noor Thabit on 10/17/15.
//  Copyright © 2015 4H. All rights reserved.
//

import UIKit
import Alamofire


class UserViewController: UIViewController {
    
    //@IBOutlet weak var welcomeUserText: UITextField!
    
  
    @IBOutlet  var welcomeLabel: UILabel? = UILabel()
    @IBOutlet  var animalName: UILabel? = UILabel()
    @IBOutlet   var viewAnimalButton: UIButton? = UIButton()
   
    @IBOutlet weak var animalBreed: UILabel? = UILabel()

    var user = User()
    var postReturn: String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // welcomeUserText = UITextField()
        // Do any additional setup after loading the view.


        
    }
    
    override func viewDidAppear(animated: Bool) {
        updateLabels()

    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func updateLabels(){
            self.animalName!.text = self.user.animals[0].name
            self.animalBreed!.text = self.user.animals[0].breed

            //animalName.text = user.animals[0].name
            //animalBreed.text = user.animals[0].breed
        
        
    }
    
    @IBAction func view(sender: AnyObject) {
        loadAnimals()
        updateLabels()
    }
    
    
    
    func loadAnimals(){
        let parameters = [
            "token":"\(user.token)"
        ]
        let url = "http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/api/viewanimals"
        Alamofire.request(.POST, url, parameters: parameters).responseJSON { response in
            print(response.result)   // result of response serialization
            
            if let JSON = response.result.value {
                print(String(JSON[0]["name"]!!))
                self.user.animals[0].name = String(JSON[0]["name"]!!)
                self.user.animals[0].breed = String(JSON[0]["breed"]!!)
                self.user.animals[0].type = String(JSON[0]["type"]!!)
                self.user.animals[0].managedBy = String(JSON[0]["managedBy"]!!)
                self.user.animals[0].date = Int(String(JSON[0]["type"]!!))


                print(JSON[0]["type"])
            }
        }
    }
    
    
    
    
    
    
    /*
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
    // Get the new view controller using segue.destinationViewController.
    // Pass the selected object to the new view controller.
    }
    */
    
}
