const mongoose              = require("mongoose");
const ObjectID              = require("mongodb").ObjectID;
const WorkspaceDetails      = require('../models/workspaceDetails');
const CafeMenu              = require('../models/CafeMenu');
const SeatBooking           = require('../models/seatBooking');
const User                  = require('../../coreAdmin/models/users');
var   request               =require ('request-promise');
const globaleVaiable        = require('../../../nodemon.js');

exports.create_workspace = (req,res,next)=>{
    const workspaceDetails = new WorkspaceDetails({
                _id                    : new mongoose.Types.ObjectId(),
                nameOfCafe             : req.body.nameOfCafe,
                address                : req.body.address,
                landmark               : req.body.landmark,
                area                   : req.body.area,
                city                   : req.body.city,
                state                  : req.body.state,
                country                : req.body.country,
                pin                    : req.body.pin,
                location               : req.body.location,
                numberOfSeats          : req.body.numberOfSeats,
                name                   : req.body.name,
                mobile                 : req.body.mobile,
                email                  : req.body.email,
                facilities             : req.body.facilities ,
                cost                   : req.body.cost ,
                openingtime            : req.body.openingtime ,
                closingtime            : req.body.closingtime ,
                createdBy              : "user_id" ,
                createdAt              : new  Date(),
                logo                   : req.body.logo,
                banner                 : req.body.banner,
                workspaceImages        : req.body.workspaceImages,
                cafeAdmin              : req.body.cafeAdmin,
                reason                 : req.body.reason,
                isOpen                 : true,
                status                 : '',
                bankDetails            : {
                                       bankName         :req.body.bankDetails.bankName,
                                       AccountNumber    :req.body.bankDetails.AccountNumber,
                                       ifscCode         :req.body.bankDetails.ifscCode,
                                       branchName       :req.body.bankDetails.branchName,
                                       accHolderName    :req.body.bankDetails.accHolderName,
                }
            
        });
        workspaceDetails.save()
                        .then(data=>{
                            res.status(200).json({ message: "Workspace Details Submitted Successfully",ID:data._id});
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
             });
};

function availableSeats(workSpace_id){
    return new Promise(function(resolve,reject){
        request({
            "method" : "GET",
            "url"    : "http://localhost:"+globaleVaiable.PORT+"/api/seatbooking/get/availableSeats/"+workSpace_id,
            // "body"   : "",
            "json"   : true,
            "header" : {
                            "User-Agent" : "Test Agent",
                        }
        })
        .then(data=>{
            resolve(data);
        })
        .catch(err=>{
            console.log("err ",err);
            reject(err);
        })
    });
}
exports.id_cafeAdmin = (req, res, next) => {
    WorkspaceDetails.findOne({ "cafeAdmin": req.params.user_id })
        .exec()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}
exports.alllist_workspace = (req,res,next)=>{
    WorkspaceDetails
    .find()
    .sort({"createdAt":-1})
    .exec()
    .then(data=>{
        if(data.length > 0 ){
            getData();
            async function getData(){
            var returndata= [];
            for(k = 0 ; k < data.length ; k++){
             var seatData = await availableSeats(data[k]._id);
              returndata.push({
                "workspace_id"    : data[k]._id,
                "nameOfCafe"      : data[k].nameOfCafe,
                // "address"         : data[k].address,
                // "landmark"        : data[k].landmark,
                // "area"            : data[k].area,
                // "city"            : data[k].city,
                // "state"           : data[k].state,
                // "country"         : data[k].country,
                // "pin"             : data[k].pin,
                "location"        : data[k].location,
                "numberOfSeats"   : data[k].numberOfSeats,
                // "name"            : data[k].name,
                "email"           : data[k].email,
                // "facilities"      : data[k].facilities,
                // "cost"            : data[k].cost,
                "openingtime"     : data[k].openingtime,
                "closingtime"     : data[k].closingtime,
                "logo"            : data[k].logo,
                "banner"          : data[k].banner,
                "workspaceImages" : data[k].workspaceImages,
                "seatData"        : seatData,
                // "cafeAdmin"       : data[k].cafeAdmin,
                // "bankDetails"     : data[k].bankDetails,
                
              })
             }
             if(k >= data.length){
                res.status(200).json(returndata);
             }
        }
        }else{
            res.status(200).json({message : "Data not found"});
        }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}


function getlatlongradious(location,centerlat,centerlong,range){
    var ky = 40000/360;
    console.log('ky=======>>>>',ky)

    var kx = Math.cos(Math.PI * centerlat/180.0) * ky;
    console.log('center.latitude=======>>>>',centerlat)

    var dx = Math.abs(centerlong - location.longitude) * kx;
    console.log('center.longitude=======>>>>',centerlong)
    console.log('location.longitude=======>>>>',location.latitude)
    console.log('location.longitude=======>>>>',location.longitude)

    var dy = Math.abs(centerlat - location.latitude) * ky;
    console.log('dy=======>>>>',dy)
    console.log('Math.sqrt(dx * dx + dy * dy) Cal=======>>>>',Math.sqrt(dx * dx + dy * dy))
    console.log('Math.sqrt(dx * dx + dy * dy) <= range=======>>>>',Math.sqrt(dx * dx + dy * dy) <= range)

    return Math.sqrt(dx * dx + dy * dy) <= range
    
}

function distance(lat1, lon1, lat2, lon2, unit) {
    console.log("Pi = ", Math.PI);

    return new Promise((resolve,reject)=>{
        if ((lat1 == lat2) && (lon1 == lon2)) {
            resolve(0);
        }
        else {
            var radlat1 = (Math.PI * lat1)/180;
            var radlat2 = (Math.PI * lat2)/180;
            var theta = lon1 - lon2;
            var radtheta = (Math.PI * theta)/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = (dist * 180)/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 ;}
            console.log("dist = ",dist);
            resolve(dist);
        }
    })
	
}
exports.list_workspace = (req,res,next)=>{
    console.log("inside list_workspace = ", req.body);
    WorkspaceDetails
    .find({})
    .sort({"createdAt":-1})
    .exec()
    .then(data=>{
        console.log("Total Cafes = ",data.length);
        var currLat  = req.body.lastlat
        var currLong = req.body.lastlong;
        console.log("currLat = " + currLat + "  |  currLong = "+currLong);
        if(data.length > 0 ){
            var k = 0;
            getData();

            async function getData(){
            var returndata= [];
            for(k = 0 ; k < data.length ; k++){
                console.log('data = ' + data[k].nameOfCafe + "  |  lat = " + data[k].location.latitude+ "  |  long = "+data[k].location.longitude );

                var cafeLat = data[k].location.latitude;
                var cafeLong = data[k].location.longitude;
                console.log("currLat = " + currLat + "  |  currLong = "+currLong);
                console.log("cafeLat = " + cafeLat + "  |  cafeLong = "+cafeLong);
                
                
                

                    var inRange  = await distance(cafeLat,cafeLong,currLat,currLong,"K");
                    // var inRange = await getlatlongradious(data[k].location,req.body.lastlat,req.body.lastlong,20)
                    console.log('inRNGE=====>',parseInt(inRange))
                    if(parseInt(inRange) <= 20){
                        var seatData = await availableSeats(data[k]._id);
                        returndata.push({
                          "workspace_id"    : data[k]._id,
                          "nameOfCafe"      : data[k].nameOfCafe,
                          "location"        : data[k].location,
                          "numberOfSeats"   : data[k].numberOfSeats,
                          "openingtime"     : data[k].openingtime,
                          "closingtime"     : data[k].closingtime,
                          "logo"            : data[k].logo,
                          "banner"          : data[k].banner,
                          "workspaceImages" : data[k].workspaceImages,
                          "seatData"        : seatData,
                        })  
                        // console.log("out of If return Data=====>",returndata);
        
                        
                    }
                    
                }

                if(k >= data.length){
                    console.log("Inside If return Data ===>",returndata);
                    res.status(200).json(returndata);
                 }
          
             
        }
        }else{
            res.status(200).json({message : "Data not found"});
        }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}
exports.listcity_workspace = (req,res,next)=>{
    WorkspaceDetails.find()
    .sort({"createdAt":-1})
        .exec()
        .then(data=>{
            if(data){
               var info = data.map((city,index)=>{
                    return city.city

               }) 
               info = [...new Set(info)];
                res.status(200).json(info);
            }else{
                res.status(200).json('Not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.single_workspace = (req,res,next)=>{
   CafeMenu.find({'workspaceID':req.params.workspaceID})
     .sort({"createdAt":-1})
        .exec()
        .then(data=>{
            // res.status(200).json(data);
            WorkspaceDetails.findOneAndUpdate({"_id":req.params.workspaceID},
                {$set:{
                    cafeMenu: data
                    }
                },
                // {returnOriginal: false},
            )
            .exec()
            .then(workspace=>{
                if(workspace){
                  res.status(200).json(workspace)
                }else{
                  res.status(400).json("Not updated")
                }
            })
            .catch(error=>{
                res.status(400).json('No workspace added')
            })
        })
        .catch(error=>{
            console.log(error)
            res.status(500).json('Not Found')
        })
    }
exports.update_workspace = (req,res,next)=>{
    WorkspaceDetails
    .updateOne({"_id":req.params.workspaceID},
                       { $set:{
                                        
                            nameOfCafe             : req.body.nameOfCafe,
                            address                : req.body.address,
                            landmark               : req.body.landmark,
                            area                   : req.body.area,
                            state                  : req.body.state,
                            city                   : req.body.city,
                            country                : req.body.country,
                            pin                    : req.body.pin,
                            location               : req.body.location,
                            numberOfSeats          : req.body.numberOfSeats,
                            name                   : req.body.name,
                            mobile                 : req.body.mobile,
                            email                  : req.body.email ,
                            facilities             : req.body.facilities,
                            cost                   : req.body.cost,
                            openingtime            : req.body.openingtime,
                            closingtime            : req.body.closingtime,
                            reason                 : req.body.reason,
                            createdBy              : "ddd" ,
                            createAt               : new  Date(),
                            // updatedBy              : "ddd",
                            lastUpdateAt           : new Date(),
                            logo                   : req.body.logo,
                            banner                 : req.body.banner,
                            workspaceImages        : req.body.workspaceImages,
                            // cafeAdmin              : req.body.cafeAdmin,
                            isOpen                 : true,
                             bankDetails           : {  

                                               bankName         :req.body.bankDetails.bankName,
                                               AccountNumber    :req.body.bankDetails.AccountNumber,
                                               ifscCode         :req.body.bankDetails.ifscCode,
                                               branchName       :req.body.bankDetails.branchName,
                                               accHolderName    :req.body.bankDetails.accHolderName,
                                  }
                            }
                                    
                        })
                        .exec()
                        .then(data=>{
                         if(data){
                            if(data.nModified==1){
                            res.status(200).json("Successful");
                             }
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                        error: err
                    });
                });
   };

function getuserDetails(user_id){
    return new Promise(function(resolve,reject){
        User.findOne({"_id": new ObjectID(user_id)})
                        .exec()
                        .then(data=>{
                            resolve(data);
                        })
                        .catch(err=>{
                            reject(err);
                  });
            });
}

exports.update_workspacestatus = (req,res,next)=>{
    WorkspaceDetails
    .updateOne({"_id":req.params.workspaceID},
                       { $set:{
                                        
                            status  : req.body.status,
                    
                            }
                                    
                        })
                        .exec()
                        .then(data=>{
                         if(data){
                            if(data.nModified==1){
                            res.status(200).json("Successful");
                             }
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                        error: err
                    });
                });
   };   

exports.delete_workspace = (req,res,next)=>{
    WorkspaceDetails.deleteOne({_id:req.params.workspaceID})
        .exec()
        .then(data=>{
            res.status(200).json("workspace deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
     });
}


/*Reports API*/



exports.dailyCheckins_Report=(req,res,next)=>{
    // var currDate = new Date();
    // var day = currDate.getDate();
    // var month = currDate.getMonth() + 1;
    // var year = currDate.getYear();
    // if (year < 1900){
    //     year = year + 1900;
    // }
    // if(day<10 || day.length<2){day = '0' + day;}
    // if(month<10 || month.length<2){month = '0' + month;}
    // var currDateISO = year+"-"+month+"-"+day;

    WorkspaceDetails
        .findOne({_id : req.params.workspace_id})
        .exec()
        .then(workspace => {
            SeatBooking
                .find({
                    workSpace_id : req.params.workspace_id,
                    date :  req.body.date,
                })
                // .estimatedDocumentCount()
                .exec()
                .then(seatdata =>{
                    if(seatdata.length>0){
                }
                       
                        getData();
                        async function getData(){ 
                        var returnData=[];
                        for(i = 0 ; i < seatdata.length ; i++){
                           var userData = await getuserDetails(seatdata[i]);
                            returnData.push({
                             "user_id"           : userData._id,
                             "workspace_id"      : seatdata[i].workSpace_id,
                             "checkInTime"       : seatdata[i].checkInTime,
                             "checkOutTime"      : seatdata[i].checkOutTime,
                             "userName"          : userData.profile.fullName,
                            });
                          }
                             if(i >= seatdata.length){
                                res.status(200).json(returnData);
                             }
                        }
                    
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });

        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        }); 
 };



 exports.dailyOrder_Report=(req,res,next)=>{

    var currDate = new Date();
    var day = currDate.getDate();
    var month = currDate.getMonth() + 1;
    var year = currDate.getYear();
    if (year < 1900){
        year = year + 1900;
    }
    if(day<10 || day.length<2){day = '0' + day;}
    if(month<10 || month.length<2){month = '0' + month;}
    var currDateISO = year+"-"+month+"-"+day;

    WorkspaceDetails
        .findOne({_id : req.params.workspace_id})
        .exec()
        .then(workspace => {
             cafedata= workspace.cafeMenu[0];   
            SeatBooking
                .find({
                    workSpace_id : req.params.workspace_id,
                    // date :  currDateISO,
                })
                // .estimatedDocumentCount()
                .exec()
                .then(seatdata =>{
                    const checkIn=seatdata.length;
                        var returnData = {
                            reportdata        : [],
                        };
                        getData();
                        async function getData(){ 
                            for(i = 0 ; i < seatdata.length ; i++){
                               var userData = await getuserDetails(seatdata[i].user_id);
                                returnData.reportdata.push({
                                 "user_id"           : userData._id,
                                 "checkInTime"       : seatdata[i].checkInTime,
                                 "userName"          : userData.profile.fullName,
                                 "itemName"          : cafedata.itemName,
                                 "price"             : cafedata.cost,
                                 "checkIn"           : checkIn,
                                 
                                });
                             }
                             if(i >= seatdata.length){
                                res.status(200).json(returnData);
                             }
                        }
                    
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });

        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
 
};
    


exports.dailyBeverage_Report=(req,res,next)=>{
    WorkspaceDetails
          .aggregate([
            {
              '$match' : { "_id" : new ObjectID(req.params.workspace_id)}
            },
            {
                "$project" : {
                    "cafeMenu" : 1
                }
            },
            {
                "$unwind" : "$cafeMenu"
            },
            {
                "$group" : {
                                "_id": { "beverage":"$cafeMenu.itemName" }, 
                                "count":{$sum:1}
                            }
            },
            {
                "$project" : {
                    "beverage" : "$_id.beverage",
                    "count"    : 1,
                    "_id"      : 0
                }
            }
            // { $sort: { count: -1 } }
        ])

        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
        
    };

    exports.cafe_search = (req,res,next)=>{
        WorkspaceDetails.find(
            {$or:[
                {"area"         :   { "$regex": req.body.searchText, $options: "i"}},
                {"nameOfCafe"   :   { "$regex": req.body.searchText, $options: "i"}},
                {"city"         :   { "$regex": req.body.searchText, $options: "i"}},
            ]},
            
        )
        .exec()
        .then( data =>{
            if(data.length > 0 ){
                getData();
                async function getData(){
                var returndata= [];
                for(k = 0 ; k < data.length ; k++){
                 var seatData = await availableSeats(data[k]._id);
                  returndata.push({
                    "workspace_id"    : data[k]._id,
                    "nameOfCafe"      : data[k].nameOfCafe,
                    "address"         : data[k].address,
                    "landmark"        : data[k].landmark,
                    "area"            : data[k].area,
                    "city"            : data[k].city,
                    "state"           : data[k].state,
                    "country"         : data[k].country,
                    "pin"             : data[k].pin,
                    "location"        : data[k].location,
                    "numberOfSeats"   : data[k].numberOfSeats,
                    "name"            : data[k].name,
                    "email"           : data[k].email,
                    "facilities"      : data[k].facilities,
                    "cost"            : data[k].cost,
                    "openingtime"     : data[k].openingtime,
                    "closingtime"     : data[k].closingtime,
                    "logo"            : data[k].logo,
                    "banner"          : data[k].banner,
                    "workspaceImages" : data[k].workspaceImages,
                    "seatData"        : seatData,
                    "cafeAdmin"       : data[k].cafeAdmin,
                    "bankDetails"     : data[k].bankDetails,
                    
                  })
                 }
                 if(k >= data.length){
                    res.status(200).json(returndata);
                 }
            }
            }else{
                res.status(200).json({message : "Data not found"});
            }
            // if(data.length > 0){
                
            //     return res.status(200).json({
                    
            //         "message" : 'Search-Successfull',
            //             "data": data
            //     });     
            // }else{
            //     return res.status(404).json({
            //         "message" : 'No-Data-Available',        
            //     }); 
            // }   
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                
                error: err
            });
        });
    }
