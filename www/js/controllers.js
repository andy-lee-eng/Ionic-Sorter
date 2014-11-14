angular.module('starter.controllers', [])

.controller('HomeCtrl', function ($scope) {
    $scope.contacts = [
        { name: 'Frank', img: 'frank.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
        { name: 'Susan', img: 'susan.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
        { name: 'Emma', img: 'emma.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
        { name: 'Scott', img: 'scott.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
        { name: 'Bob', img: 'bob.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
        { name: 'Olivia', img: 'olivia.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
        { name: 'Anne', img: 'anne.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' }
    ];

    $scope.onReorder = function (fromIndex, toIndex) {
        var moved = $scope.contacts.splice(fromIndex, 1);
        $scope.contacts.splice(toIndex, 0, moved[0]);
    };
});
