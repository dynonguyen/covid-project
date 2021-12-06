
INSERT INTO "Account" ("accountId", "username", "password", "accountType", "isLocked", "failedLoginTime") VALUES
(1,  'nguyenvana', 'nguyenvana123','0','1','0'),
(2, 'nguytnthiebb', '123dsdqw22','0','0','0'),
(3, 'nguyenvanccdd', '8282dfspwo','0','0','1'),
(4, 'nguyvanthixyz', '12ssdww','0','0','0'),
(5, 'nguyenvana', '2ddgse','1','0','1'),
(6, 'nguyenvana', '22ffgww','1','0','0'),
(7, 'nguyenvana', 'rrtw323','0','0','1'),
(8, 'nguyenvana', 'yt6753e','1','0','0'),
(9, 'nguyenvanb','213dwwe','0','0','0');


INSERT INTO "AccountHistory" ("accountHistoryId", "activity", "createdDate", "accountId") VALUES
(1,  'Hanh Dong 1', '2021-12-01 14:23:32',1),
(2, 'Hanh Dong 2', '2021-12-01 14:23:32',2),
(3, 'Hanh Dong 3', '2021-12-01 14:23:32',3),
(4, 'Hanh Dong 4', '2021-12-01 14:23:32',4),
(5, 'Hanh Dong 5', '2021-12-01 14:23:32',5),
(6, 'Hanh Dong 6', '2021-12-01 14:23:32',6),
(7, 'Hanh Dong 7', '2021-12-01 14:23:32',7),
(8, 'Hanh Dong 8', '2021-12-01 14:23:32',8),
(9, 'Hanh Dong 9','2021-12-01 14:23:32',9);


INSERT INTO "Address" ("addressId", "details", "wardId") VALUES
(1,  '1 Nguyen Chi Thanh', '1'),
(2,  '2 Vo Nguyen Giap', '20'),
(3,  '3/123 To Vinh Dien', '33'),
(4,  '42/22/22 Tay Thanh, Ho Chi Minh', '4');


INSERT INTO "IsolationFacility" ("isolationFacilityId", "isolationFacilityName", "capacity", "currentQuantity", "addressId") VALUES
(1,  'Khu A - Binh Duong', '1000000','400000','1'),
(2,  'Khu B - Dong Nai', '1500000','200000','2'),
(3,  'Khu C - Thanh Pho Ho Chi Minh', '600000','100000','3'),
(4,  'Khu D - Ha Noi', '450000','30000','4');


INSERT INTO "User" ("userId", "uuid", "fullname", "peopleId", "DOB", "statusF", "createdAt","updatedAt", "managerId", "accountId", "addressId") VALUES
(1,  'ec1100f8-5679-11ec-bf63-0242ac130002', 'NguyenVanA','1234567','1970-01-01 07:00:00+07', '0', '2021-12-01 14:23:32', '2021-12-06 10:39:32','5', '1', '1'),
(2,  '0c149ec8-567a-11ec-bf63-0242ac130002', 'NguyenVanB','2233123','1970-01-01 07:00:00+07', '0', '2021-12-02 19:23:32', '2021-12-06 10:39:32','5', '2', '2'),
(3,  '1044e5a2-567a-11ec-bf63-0242ac130002', 'NguyenVanC','3231231','1970-01-01 07:00:00+07', '0', '2021-12-03 10:23:32', '2021-12-06 10:39:32','6', '3', '3'),
(4,  '12b3939c-567a-11ec-bf63-0242ac130002', 'NguyenVanD','4312317','1970-01-01 07:00:00+07', '0', '2021-12-04 09:23:32', '2021-12-06 10:39:32','8', '4', '4');


INSERT INTO "RelatedUser" ("relatedId", "originUserId", "relatedUserId") VALUES
(1, 3, 2),
(2, 1, 4),
(3, 4, 8);


INSERT INTO "TreatmentHistory" ("treatmentHistoryId", "startDate", "endDate", "statusF", "userId", "isolationFacilityId") VALUES
(1, '2021-12-05 22:06:58.466+07', '2021-12-11 22:06:58.466+07',0,1,4),
(2, '2021-12-08 23:06:58.466+07', '2021-12-14 22:06:58.466+07',0,2,3),
(3, '2020-12-09 20:06:58.466+07', '2021-12-15 22:06:58.466+07',0,3,1);


INSERT INTO "ProductPackage" ("productPackageId", "productPackageName", "limitedProducts", "limitedInDay", "limitedInWeek", "limitedInMonth") VALUES
(1, 'Thuoc AA', 1, 10, 70, 280),
(2, 'Thuoc BB', 2, 20, 140, 560),
(3, 'Thuoc CC', 3, 30, 210, 840);



INSERT INTO "Product" ("productId", "productName", "price", "unit") VALUES
(1, 'Thuoc A1', 450000, 12345),
(2, 'Thuoc A3', 650000, 23121),
(3, 'Thuoc A2', 150000, 23555);

INSERT INTO "ProductInPackage" ("productInPackageId", "maxQuantity", "quantity", "productId", "productPackageId") VALUES
(1, 20, 5, 1, 3),
(2, 30, 20, 2, 2),
(3, 40, 30, 3, 1);


INSERT INTO "ProductImage" ("productImageId", "src", "isThumbnail", "productId") VALUES
(1, 'src1', '1', 1),
(2, 'src2', '0', 2),
(3, 'src3', '1', 3);


INSERT INTO "PaymentHistory" ("paymentHistoryId", "paymentDate", "currentBalance", "paymentType", "paymentCode", "totalMoney", "userId", "consumptionHistoryId") VALUES
(1, '2021-12-08 23:06:58.466+07', 3600000, 1, 'ec1100f8-5679-11ec-bf63-0242ac130002', 1500000, 1, 1),
(2, '2021-12-10 13:10:58.466+07', 6600000, 1, '0c149ec8-567a-11ec-bf63-0242ac130002', 1000000, 2, 2),
(3, '2021-12-15 19:55:58.466+07', 16600000, 1, '12b3939c-567a-11ec-bf63-0242ac130002', 2500000, 3, 3);


INSERT INTO "ConsumptionHistory" ("consumptionHistoryId", "buyDate", "totalPrice", "userId", "productPackageId") VALUES
(1, '2021-12-08 23:06:58.466+07', 3600000, 1, 1),
(2, '2021-12-10 13:10:58.466+07', 6600000, 2, 2),
(3, '2021-12-15 19:55:58.466+07', 16600000, 3, 3);
