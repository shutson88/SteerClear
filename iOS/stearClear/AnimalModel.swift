//
//  AnimalModel.swift
//  stearClear
//
//  Created by Noor Thabit on 10/17/15.
//  Copyright © 2015 4H. All rights reserved.
//

import Foundation

class Animal {
    var id: String!
    var managedBy: String!
    var name: String!
    var type: String!
    var breed: String!
    var date: Int!
    var weight: [Int:String]!
    
    init() {
        id = String()
        managedBy = String()
        name = String()
        type = String()
        breed = String()
        date = Int()
        weight = [Int:String]()
    }
    
}