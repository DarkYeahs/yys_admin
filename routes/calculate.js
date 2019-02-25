const express = require('express')
const router = express.Router()
const path = require('path')
const xlsx = require('node-xlsx')
const conf = require('../conf')

const typeList = conf.typeList
const attr2Type = conf.attr2Type
const cp = require('child_process')
// const numCPUs = 1;
const numCPUs = require('os').cpus().length


const multer  = require('multer')
const upload = multer({ dest: path.join(__dirname, '../tmp') })


router.post('/', upload.any(), function(req, res, next) {

    const files = req.files
    const userFile = files[0]
    let childList = []
    const data = xlsx.parse(userFile.path)
    const requireList = analysisRequire(req.body || {})
    const list = analysisData(data, requireList)
    let end = 0
    let result = []

    console.log('size:', list.size)
    
    for (let i = 0; i < numCPUs; i++) {

    
        const child = cp.fork('./calculate')
        child.on('message', ({code, data}) => {
            if (code === 0) {
                result.push(data)
            }
            // else 
        });

        child.on('disconnect', () => {
            console.log('disconnect')
            end++

            if (end === numCPUs) {
                if (result.length > 100) result = result.slice(0, 100)
                res.send(JSON.stringify({
                    data: result,
                    result_num: result.length
                }))
            }
        })
        const limit = Math.ceil((i + 1) * list.size / numCPUs)
        child.send({
            code: 0,
            data: {
                list: list,
                requireList: requireList,
                index: Math.ceil(i * list.size / numCPUs),
                limit: limit > list.size ? list.size : limit
            }
        });
    }
});

function analysisData (data, requireList) {

    const value = (data && data[0] && data[0].data) || []
    let list = []
    let result = []

    value.map((item, index) => {
        if (index === 0) return
        
        if (item && item.length > 0) {
            let obj = {}

            obj.id = item[0]
            obj.type = item[1]
            obj.position = item[2]
            obj.attack = item[3] || 0
            obj.attackAddtion = item[4] || 0
            obj.defense = item[5] || 0
            obj.defenseAddtion = item[6] || 0
            obj.crit = item[7] || 0
            obj.bruise = item[8] || 0
            obj.life = item[9] || 0
            obj.lifeAddtion = item[10] || 0
            obj.hit = item[11] || 0
            obj.resistance = item[12] || 0
            obj.speed = item[13] || 0

            if (obj.position % 2 === 0) {
                let isAgree = false

                switch (obj.position) {
                    case 2:
                        isAgree = isRequirePositionData(obj, requireList.secondRequire);
                        break;
                    case 4:
                        isAgree = isRequirePositionData(obj, requireList.fourthRequire)
                        break;
                    case 6:
                        isAgree = isRequirePositionData(obj, requireList.sixthRequire)
                        break;
                    default:;
                }

                if (!isAgree) return
            }

            if (!checkType(obj, requireList)) return

            if (!list[obj.position - 1]) list[obj.position - 1] = []

            list[obj.position - 1].push(obj)

        }
    })

    let resultList = combins(...list)
    

    return resultList
}

function analysisRequire (data, requireList) {
    const mitama_suit = data.mitama_suit
    const prop_limit = data.prop_limit
    const upper_prop_limit = data.upper_prop_limit
    const sec_prop_value = data.sec_prop_value
    const fth_prop_value = data.fth_prop_value
    const sth_prop_value = data.sth_prop_value
    const ignore_serial = data.ignore_serial
    const all_suit = data.all_suit
    const damage_limit = data.damage_limit
    const health_limit = data.health_limit
    const attack_only = data.attack_only
    const effective_secondary_prop = data.effective_secondary_prop
    const effective_secondary_prop_num = data.effective_secondary_prop_num

    let typeRequireList = mitama_suit.split('.') || []
    let requireValue = damage_limit.split(',') || []
    let baseAttack = +requireValue[0]
    let baseBruise = +requireValue[1]
    let requireDamage = +requireValue[2]
    let secondRequire = sec_prop_value.split('.') || []
    let fourthRequire = fth_prop_value.split('.') || []
    let sixthRequire = sth_prop_value.split('.') || []
    let upLimit = upper_prop_limit.split('.') || []
    let subLimit = prop_limit.split('.') || []
    let typeSum = 0
    let typeLists = []
    let isRequireType = false

    typeRequireList = typeRequireList.map(item => {
        const tmp = item.split(',') || []

        typeSum += +tmp[1] || 0

        console.log('typeSum', typeSum)

        if (attr2Type[tmp[0]]) {
            typeLists = typeLists.concat(attr2Type[tmp[0]])
        }
        else {
            typeLists.push(tmp[0])
        }
        
        return {
            type: tmp[0],
            num: +tmp[1] || 0
        }
    })

    if (typeSum === 6) isRequireType = true

    secondRequire = secondRequire.map(item => {
        const tmp = item.split(',') || []

        return {
            type: typeList[tmp[0]] || '',
            data: +tmp[1]
        }
    })

    fourthRequire = fourthRequire.map(item => {
        const tmp = item.split(',') || []

        return {
            type: typeList[tmp[0]] || '',
            data: +tmp[1]
        }
    })

    sixthRequire = sixthRequire.map(item => {
        const tmp = item.split(',') || []

        return {
            type: typeList[tmp[0]] || '',
            data: +tmp[1]
        }
    })

    upLimit = upLimit.map(item => {
        const tmp = item.split(',') || []

        return {
            type: typeList[tmp[0]] || '',
            data: +tmp[1]
        }
    })

    subLimit = subLimit.map(item => {
        const tmp = item.split(',') || []

        return {
            type: typeList[tmp[0]] || '',
            data: +tmp[1]
        }
    })

    return {
        typeRequireList,
        baseAttack,
        baseBruise,
        requireDamage,
        secondRequire,
        fourthRequire,
        sixthRequire,
        upLimit,
        subLimit,
        isRequireType,
        typeLists
    }

}

function combins () {
    if (arguments.length < 2) return arguments[0] || [];
    var args = Array.prototype.slice.call(arguments);
    var that = {
        index: 0,
        nth: function (n) {
            var result = [],
                d = 0;
            for (; d < this.dim; d++) {
                var l = this[d].length;
                var i = n % l;
                result.push(this[d][i]);
                //  对每个元素集合size依次向下取整
                n -= i;
                n /= l;
            }
            return result;
        },
        next: function () {
            if (this.index >= size) return;
            var result = this.nth(this.index);
            this.index++;
            return result;
        },

        getItem: function (index) {
            if (index >= size) return

            return this.nth(index)
        }
    };
    var size = 1;
    for (var i = 0; i < args.length; i++) {
        size = size * args[i].length;
        that[i] = args[i];
    }
    that.size = size;
    that.dim = args.length;
    return that;
}

function isRequirePositionData (data, requireData) {
    const len = requireData.length

    if (len === 0) return true
    if (!data) return false

    for (let i = 0; i < len; i++) {
        const item = requireData[i]
        
        if (data[item.type] >= item.data) return true
    }

    return false

}

function checkType (data, requireList) {
    if (!requireList.isRequireType) return true
    
    return requireList.typeLists.indexOf(data.type) > -1
}



router.get('/', function(req, res, next) {
});

 

module.exports = router;