function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("COUNTRY", [
    {
        name: 'Australia',
        shortName: 'AU'
    },
    {
        name: 'Thailand',
        shortName: 'TH'
    }
]);

define("EMPLOYEETYPE", [
    {
        typeId: '10',
        typeName: 'พนักงานใหม่'
    },
    {
        typeId: '20',
        typeName: 'พนักงานเก่า'
    },
    {
        typeId: '30',
        typeName: 'รีเซฟชั่น'
    }
]);

define("TRANSACTIONTYPE", [
    {
        typeId: 1000,
        typeName: 'รายรับ'
    },
    {
        typeId: 2000,
        typeName: 'รายจ่าย'
    }
]);

define("PRODUCTTYPE", [
    {
        typeId: 1000,
        typeName: 'สินค้า'
    },
    {
        typeId: 2000,
        typeName: 'บริการ'
    }
]);