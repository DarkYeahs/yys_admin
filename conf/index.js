const typeList = {
    '攻击': 'attack',
    '攻击加成': 'attackAddtion',
    '防御': 'defense',
    '防御加成': 'defenseAddtion',
    '暴击': 'crit',
    '暴击伤害': 'bruise',
    '生命': 'life',
    '生命加成': 'lifeAddtion',
    '效果抵抗': 'resistance',
    '效果命中': 'hit',
    '速度': 'speed'
}

const extraData = {
    '针女': {
        crit: 15
    },
    '破势': {
        crit: 15
    },
    '网切': {
        crit: 15
    },
    '三味': {
        crit: 15
    },
    '伤魂鸟': {
        crit: 15
    },
    '镇墓兽': {
        crit: 15
    },
    '蝠翼': {
        attackAddtion: 15
    },
    '鸣屋': {
        attackAddtion: 15
    },
    '心眼': {
        attackAddtion: 15
    },
    '狰': {
        attackAddtion: 15
    },
    '轮入道': {
        attackAddtion: 15
    },
    '狂骨': {
        attackAddtion: 15
    },
    '阴摩罗': {
        attackAddtion: 15
    },
    '树妖': {
        lifeAddtion: 15
    },
    '地藏像': {
        lifeAddtion: 15
    },
    '薙魂': {
        lifeAddtion: 15
    },
    '镜姬': {
        lifeAddtion: 15
    },
    '钟灵': {
        lifeAddtion: 15
    },
    '涅槃之火': {
        lifeAddtion: 15
    },
    '被服': {
        defenseAddtion: 30,
    },
    '珍珠': {
        defenseAddtion: 30,
    },
    '魅妖': {
        defenseAddtion: 30,
    },
    '雪幽魂': {
        defenseAddtion: 30,
    },
    '招财猫': {
        defenseAddtion: 30,
    },
    '反枕': {
        defenseAddtion: 30,
    },
    '日女己时': {
        defenseAddtion: 30,
    },
    '木魅': {
        defenseAddtion: 30,
    },
    '蚌精': {
        hit: 15
    },
    '火灵': {
        hit: 15
    },
    '骰子鬼': {
        resistance: 15
    },
    '返魂香': {
        resistance: 15
    },
    '幽谷响': {
        resistance: 15
    },
    '魍魉之匣': {
        resistance: 15
    },
    '荒骷髅': {},
    '土蜘蛛': {},
    '地震鲶': {},
    '蜃气楼': {},
    '胧车': {}
}

const attr2Type = {
    '暴击': ['针女', '破势', '网切', '三味', '伤魂鸟', '镇墓兽'],
    '攻击加成': ['蝠翼', '鸣屋', '心眼', '狰', '轮入道', '狂骨', '阴摩罗'],
    '防御加成': ['被服', '珍珠', '魅妖', '雪幽魂', '招财猫', '反枕', '日女己时', '木魅'],
    '生命加成': ['树妖', '地藏像', '薙魂', '镜姬', '钟灵', '涅槃之火'],
    '效果命中': ['蚌精', '火灵'],
    '效果抵抗': ['骰子鬼', '返魂香', '幽谷响', '魍魉之匣']
}

module.exports = {
    typeList,
    extraData,
    attr2Type
}