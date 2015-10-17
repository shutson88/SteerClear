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
    
    var token: String!
    var message: String!
    
    init(){
        
        self.username = String();
        self.password = String();
        self.token = String();
        self.message = String();
        
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