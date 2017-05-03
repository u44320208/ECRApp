function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("EXPENSETYPE", [
    {
        typeId: '10',
        typeName: 'เพิ่ม'
    },
    {
        typeId: '20',
        typeName: 'ลด'
    }
]);

define("EXPENSESTATUS", [
    {
        typeId: 10,
        typeName: 'ปกติ'
    },
    {
        typeId: 20,
        typeName: 'ยกเลิก'
    }
]);

define("USERSROLE", [
    {
        typeId: 10,
        typeName: 'Admin'
    },
    {
        typeId: 20,
        typeName: 'User'
    }
]);