const redisClient = require('../redis')
const conf = require('../conf')
const extraData = conf.extraData
const attr2Type = conf.attr2Type

process.on('message', msg => {
    const code = msg.code
    const data = msg.data

    if (code !== 0) return
    
    const list = data.list
    const requireList = data.requireList
    const index = data.index
    const limit = data.limit

    // let keys = list.keys()

    for (let i = index; i < limit; i++) {
        const tmp = getItem(list, i)

        if (isRequire(tmp, requireList)) {
            process.send({
                code: 0,
                data: tmp
            })
        }
    }

    process.disconnect()
})


function isRequire (data, requireList) {
    return isRequireData(data, requireList)
        && isRequireType(data, requireList.typeRequireList)
}

function isRequireType (data, requireType) {

    let result = {}
    let len = data.length
    let typeLen = requireType.length
    let i = 0
    // let typeList = []

    // for (i = 0; i < typeLen; i++) {
    //     const item = requireType[i]

    //     typeList.push(item.type)
    // }

    for (i = 0; i < len; i++) {
        const item = data[i]
        
        if (!result[item.type]) {
            result[item.type] = {}
            result[item.type].num = 1
            result[item.type].isMatch = false
        }
        else result[item.type].num++
    }

    let isPass = true
    let keys = Object.keys(result)
    let keyLen = keys.length
    
    for (let i = 0; i < typeLen; i++) {
        const type = requireType[i]
        const item = result[type.type]
        const attr2TypeItem = attr2Type[type.type]
        
        if (item) {
            item.isMatch = true
            if (type.num > item.num) {
                isPass = false
                break
            }
            else {
                item.num -= 4
            }
        }
        else if (attr2TypeItem){
            let isSelected = false

            for (let j = 0; j < keyLen; j++) {
                let key = keys[j]
                let tmp = result[key]

                if (tmp.num >= 2 && attr2TypeItem.indexOf(key) > -1) {
                    tmp.num -= 2
                    tmp.isMatch = true
                    isSelected = true
                    break
                }
            }

            if (!isSelected) {
                isPass = false
                break
            }
        }

        else {
            isPass = false
            break
        }
    }

    // if (isPass) console.log(JSON.stringify(resultCopy))
    return isPass
}

function isRequireData (data, requireList) {
    let baseAttack = requireList.baseAttack
    let baseBruise = requireList.baseBruise
    let requireDamage = requireList.requireDamage
    let attackSum = 0
    let attackAddtionSum = 0
    let bruiseSum = baseBruise
    let critSum = 0
    let speedSum = 0
    let hitSum = 0
    let resistanceSum = 0
    let lifeSum = 0
    let lifeAddtionSum = 0
    let defenseAddtionSum = 0
    let len = data.length
    let typeList = {}

    for (let i = 0; i < len; i++) {
        const item = data[i]

        attackSum += item.attack
        bruiseSum += item.bruise
        critSum += item.crit
        attackAddtionSum += item.attackAddtion
        speedSum += item.speed
        hitSum += item.hit
        resistanceSum += item.resistance
        lifeSum += item.life
        lifeAddtionSum += item.lifeAddtion
        defenseAddtionSum += item.defenseAddtion

        if (!typeList[item.type]) typeList[item.type] = 1
        else typeList[item.type]++
    }


    for (let key in typeList) {
        if (typeList[key] >= 2) {
            attackAddtionSum += (extraData[key].attackAddtion || 0)
            critSum += (extraData[key].crit || 0)
        }
    }

    const total = {
        attack: attackSum,
        bruise: bruiseSum,
        crit: critSum,
        attackAddtion: attackAddtionSum,
        speed: speedSum,
        hit: hitSum,
        resistance: resistanceSum,
        life: lifeSum,
        lifeAddtion: lifeAddtionSum,
        defenseAddtion: defenseAddtionSum
    }

    attackSum = attackSum + baseAttack * (1 + attackAddtionSum / 100)

    return (attackSum * bruiseSum / 100 >= requireDamage) && isSubRequire(total, requireList) && isUpRequire(total, requireList)
}

function isSubRequire (data, requireData) {
    const subLimit = requireData.subLimit
    const len = subLimit.length

    // console.log('isSubRequire', data, subLimit)

    for (let i = 0; i < len; i++) {
        const item = subLimit[i]

        if (data[item.type] < item.data) return false
    }
    return true
}

function isUpRequire (data, requireData) {
    const upLimit = requireData.upLimit
    const len = upLimit.length

    for (let i = 0; i < len; i++) {
        const item = upLimit[i]

        if (data[item.type] > item.data) return false
    }
    return true
}

function getItem (data, index) {
    let size = data.size
    let dim = data.dim

    if (index >= size) return

    return nth(data, dim, index)
}

function nth (data, dim, n) {
    let result = [],
        d = 0;
    let len = data.length
    for (; d < dim; d++) {
        var l = data[d].length;
        var i = n % l;
        result.push(data[d][i]);
        //  对每个元素集合size依次向下取整
        n -= i;
        n /= l;
    }
    return result;
}