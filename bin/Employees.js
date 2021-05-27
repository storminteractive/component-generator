const validate = require('../cruds/helpers').validate;
const dbHelper = require('../cruds/helpers').dbHelper;
const mongoose = require('../connection');
const joi = require('joi');
const DateExtension = require('joi-date-extensions');

class EmployeesClass {

    defSortCol = "_id";
    defSortDir = "desc";
    DataModel = {};

    constructor() {
        this.DataModel.schema = new mongoose.Schema({
            name: { type: String, required: true },
            tel: { type: String, required: true },
            email: { type: String, required: false },
            discount: Number,
            date: { type: Date, default: "" },
            customerId: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'customers',
                required: true
            },         
            products: [
                {
                    name: String,
                    count: Number,
                    price: mongoose.Schema.Types.Decimal128
                }
            ],
            created: { type: Date, default: Date.now }
        });
        this.DataModel.model = mongoose.model('employees', this.DataModel.schema);
        this.DataModel.name = 'employees';

        this.addUpdateValidation = joi.object().keys({
            name: joi.string().min(3).max(50).error(new Error('Invalid customer name')),
            tel: joi.string().regex(/^\d+$/).min(10).max(14).required().error(new Error('Invalid telephone')),
            email: joi.string().email().max(50).optional().allow('').error(new Error('Invalid email')), // optional email
            discount: joi.number().error(new Error('Invalid discount')),
            date: joi.extend(DateExtension).date().format('YYYY-MM-DD').error(new Error('Invalid date')),
            customerId: joi.string().required().error(new Error('Invalid customer id')),
            products: joi.array().required().items()
        });

        this.updateStatusValidation = joi.object().keys({
            status: joi.string().min(3).max(50).error(new Error('Invalid membership status'))
        });

        this.helper = new dbHelper(this.DataModel);
    }

    generateCode = () => {
        return "RANDOMCODE";
    }

    create = (entry, cb) => {
        console.log(`EmployeesClass -> create -> entry`, entry);
        this.helper.create(entry, this.addUpdateValidation, (e, entry) => {
            if (e && (e.indexOf("duplicate key") > 0)) { e = "EmployeesClass - duplicate key"; }
            cb(e, entry);
        })
    }

    update = async (id, entry, cb) => {
        console.log(`EmployeesClass -> update -> id, entry`, id, entry);
        if(!id) {cb("Update error - no ID"); return;}
        
        //this.helper.update({_id: id},entry,this.addUpdateValidation,(e,entry)=>{cb(e,entry)});
        this.helper.update({_id: id},entry,this.addUpdateValidation,(e,entry)=>{cb(e,entry)});
    };

    // All will display last 20
    all = (query, sortcol, sortdir, limit, cb) => {
        let col = sortcol || this.defSortCol;
        let order = sortdir || this.defSortDir;
        limit = limit || 20;
        console.log(`EmployeesClass -> all -> query,col,order,limit`, query, col, order, limit);

        this.helper.findFull(query, col, order, limit, async (rows) => {
            cb(null, rows)
        });
    };

    details = (_id, cb) => {
        let col = this.defSortCol;
        let order = this.defSortDir;
        let limit = 1
        let query = { _id };
        let e = null;

        console.log(`EmployeesClass -> details -> query`, query);

        this.helper.findFull(query, col, order, limit, async (rows) => {
            if(rows.length<1){e = `Record not found`; };
            cb(e, rows[0]);
        });
    };

    remove = (_id, cb) => {
        if (!_id) { cb("Remove error - no ID"); return; }
        this.helper.remove({ _id: _id }, (e) => {
            if(e){e = `Error removing record ${_id}`};
            cb(e, "ok");
        });
        console.log(`EmployeesClass -> remove -> _id`, _id);
    };

    nametel = (nametel, cb) => {
        if (!nametel) {
            cb(null, null);
            return [];
        };
        let limit = 5
        let query = {
            $or: [
                { "email": { $regex: nametel, $options: "i" } },
                { "tel": { $regex: nametel, $options: "i" } }
            ]
        }
        console.log(`EmployeesClass -> nametel -> query`, query);

        this.helper.findFull(query, this.defSortCol, this.defSortDir, limit, async (rows) => {
            cb(null, rows)
        });
    };

}

module.exports = new EmployeesClass();
