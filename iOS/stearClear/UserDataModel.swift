//
//  UserData.swift
//  stearClear
//
//  Created by Noor Thabit on 10/4/15.
//  Copyright © 2015 4H. All rights reserved.
//

import Foundation

class User{
    
    var email: String!
    var fname: String!
    var lname: String!

    var username: String!
    var animals: [Animal]!
    var token: String!
    var message: String!
    
    init(){
        self.animals = [Animal]()
        self.fname = String()
        self.lname = String()
        self.email = String()
        self.username = String()
        self.token = String()
        self.message = String()
        addAnimal(0)
    }
    
    func addAnimal(num: Int){
        for _ in 0..<num {
        animals.append(Animal())
        }
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
    
    
   

}