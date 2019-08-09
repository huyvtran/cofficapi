const mongoose	= require("mongoose");

const Vendorworkspace = require('../models/Vendorworkspace');

exports.create_Vendorworkspace = (req,res,next)=>{
console.log("in vendor--------call");
        const vendorworkspace  = new Vendorworkspace({
                _id                    : new mongoose.Types.ObjectId(),
                nameOfCafe             : req.body.nameOfCafe,
                address                : req.body.address,
                landmark               : req.body.landmark,
                area                   : req.body.city,
                city                   : req.body.state,
                state                  : req.body.state,
                country                : req.body.country,
                pincode                : req.body.pincode,
                lat                    : req.body.lat,
                long                   : req.body.long,
                numberOfSeats          : req.body.numberOfSeats,
                facilities             : req.body.facilities ,
                createdBy              : req.body.createdBy ,
                createAt               : new Date(),
        });
        vendorworkspace.save()
                        .then(data=>{
                            res.status(200).json("vendor Workspace Details Submitted Successfully");
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
};

exports.list_Vendorworkspace = (req,res,next)=>{
    workspace.findOne({propertyID:req.params.workspaceID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Workspace Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
/*modified on 9/8/2019 by Karuna for QR code */
exports.single_Vendorworkspace = (req,res,next)=>{
    console.log('list');
    Vendorworkspace.findOne({"_id":req.params.workspaceID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('workspace Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}

exports.update_Vendorworkspace = (req,res,next)=>{
    workspace.updateOne(
            { _id:req.body.workspace_ID},  
            {
                $set:{
                id                     : new mongoose.Types.ObjectId(),
                nameOfCafe             : req.body.nameOfCafe,
                address                : req.body.address,
                landmark               : req.body.landmark,
                area                   : req.body.city,
                city                   : req.body.state,
                state                  : req.body.state,
                country                : req.body.country,
                pincode                : req.body.pincode,
                lat                    : req.body.lat,
                long                   : req.body.long,
                numberOfSeats          : req.body.numberOfSeats,
                facilities             : req.body.facilities ,
                createdBy              : req.body.createdBy ,
                createAt               : new Date(),
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Workspace Details Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Workspace Report Not Found"
                });
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};




exports.delete_Vendorworkspace = (req,res,next)=>{
    workspace.deleteOne({_id:req.params.workspaceID})
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
