function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("EXPENSETYPE", [
    {
        typeId: '10',
        typeName: 'เบิกจ่าย'
    },
    {
        typeId: '20',
        typeName: 'โอนลด'
    },
    {
        typeId: '30',
        typeName: 'โอนเพิ่ม'
    },
    {
        typeId: '90',
        typeName: 'คาดว่าจะใช้'
    }
]);

define("EXPENSESTATUS", [
    {
        typeId: '10',
        typeName: 'ปกติ'
    },
    {
        typeId: '20',
        typeName: 'ยกเลิก'
    }
]);

define("USERSROLE", [
    {
        typeId: '10',
        typeName: 'Admin'
    },
    {
        typeId: '20',
        typeName: 'User'
    }
]);

define("USERSTATUS", [
    {
        typeId: '10',
        typeName: 'Enable'
    },
    {
        typeId: '20',
        typeName: 'Disable'
    }
]);