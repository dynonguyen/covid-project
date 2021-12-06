-- CREATE TABLE IN DATABASE "covid-project"

BEGIN;

CREATE TABLE IF NOT EXISTS public."AdminAccount"
(
    "accountId" integer NOT NULL,
    username character varying(30) COLLATE pg_catalog."default" NOT NULL,
    password character varying(72) COLLATE pg_catalog."default",
    fullname character varying(50) COLLATE pg_catalog."default",
    "failedLoginTime" smallint NOT NULL DEFAULT 0,
    CONSTRAINT "AdminAccount_pkey" PRIMARY KEY ("accountId")
);

CREATE TABLE IF NOT EXISTS public."Account"
(
    "accountId" integer NOT NULL,
    username character varying(30) COLLATE pg_catalog."default" NOT NULL,
    password character varying(72) COLLATE pg_catalog."default",
    "accountType" smallint NOT NULL DEFAULT 0,
    "isLocked" boolean NOT NULL DEFAULT false,
    "failedLoginTime" smallint NOT NULL DEFAULT 0,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("accountId")
);

CREATE TABLE IF NOT EXISTS public."AccountHistory"
(
    "accountHistoryId" integer NOT NULL,
    activity text COLLATE pg_catalog."default" NOT NULL,
    "createdDate" timestamp with time zone NOT NULL DEFAULT '2021-12-05 21:06:58.41+07'::timestamp with time zone,
    "accountId" integer NOT NULL,
    CONSTRAINT "AccountHistory_pkey" PRIMARY KEY ("accountHistoryId")
);

CREATE TABLE IF NOT EXISTS public."Address"
(
    "addressId" integer NOT NULL,
    details character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "wardId" integer NOT NULL,
    CONSTRAINT "Address_pkey" PRIMARY KEY ("addressId")
);

CREATE TABLE IF NOT EXISTS public."ConsumptionHistory"
(
    "consumptionHistoryId" integer NOT NULL,
    "buyDate" timestamp with time zone NOT NULL DEFAULT '2021-12-05 21:06:58.434+07'::timestamp with time zone,
    "totalPrice" integer NOT NULL DEFAULT 0,
    "userId" integer NOT NULL,
    "productPackageId" integer NOT NULL,
    CONSTRAINT "ConsumptionHistory_pkey" PRIMARY KEY ("consumptionHistoryId")
);

CREATE TABLE IF NOT EXISTS public."District"
(
    id integer NOT NULL,
    name character varying(30) COLLATE pg_catalog."default" NOT NULL,
    prefix character varying(20) COLLATE pg_catalog."default" NOT NULL,
    "provinceId" integer NOT NULL,
    CONSTRAINT "District_pkey" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."IsolationFacility"
(
    "isolationFacilityId" integer NOT NULL,
    "isolationFacilityName" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    capacity integer NOT NULL DEFAULT 1,
    "currentQuantity" integer NOT NULL DEFAULT 0,
    "addressId" integer NOT NULL,
    CONSTRAINT "IsolationFacility_pkey" PRIMARY KEY ("isolationFacilityId")
);

CREATE TABLE IF NOT EXISTS public."PaymentHistory"
(
    "paymentHistoryId" integer NOT NULL,
    "paymentDate" timestamp with time zone NOT NULL DEFAULT '2021-12-05 21:06:58.441+07'::timestamp with time zone,
    "currentBalance" integer NOT NULL DEFAULT 0,
    "paymentType" smallint NOT NULL DEFAULT 1,
    "paymentCode" uuid NOT NULL,
    "totalMoney" integer NOT NULL DEFAULT 0,
    "userId" integer NOT NULL,
    "consumptionHistoryId" integer,
    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("paymentHistoryId")
);

CREATE TABLE IF NOT EXISTS public."Product"
(
    "productId" integer NOT NULL,
    "productName" character varying(50) COLLATE pg_catalog."default" NOT NULL,
    price integer NOT NULL DEFAULT 0,
    unit character varying(10) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

CREATE TABLE IF NOT EXISTS public."ProductImage"
(
    "productImageId" integer NOT NULL,
    src text COLLATE pg_catalog."default" NOT NULL,
    "isThumbnail" boolean NOT NULL DEFAULT false,
    "productId" integer NOT NULL,
    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("productImageId")
);

CREATE TABLE IF NOT EXISTS public."ProductInPackage"
(
    "productInPackageId" integer NOT NULL,
    "maxQuantity" smallint NOT NULL DEFAULT 1,
    quantity smallint NOT NULL DEFAULT 1,
    "productId" integer NOT NULL,
    "productPackageId" integer NOT NULL,
    CONSTRAINT "ProductInPackage_pkey" PRIMARY KEY ("productInPackageId")
);

CREATE TABLE IF NOT EXISTS public."ProductPackage"
(
    "productPackageId" integer NOT NULL,
    "productPackageName" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "limitedProducts" smallint NOT NULL DEFAULT 1,
    "limitedInDay" smallint NOT NULL DEFAULT 1,
    "limitedInWeek" smallint NOT NULL DEFAULT 1,
    "limitedInMonth" smallint NOT NULL DEFAULT 1,
    CONSTRAINT "ProductPackage_pkey" PRIMARY KEY ("productPackageId")
);

CREATE TABLE IF NOT EXISTS public."Province"
(
    id integer NOT NULL,
    name character varying(30) COLLATE pg_catalog."default" NOT NULL,
    code character varying(5) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Province_pkey" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."RelatedUser"
(
    "relatedId" integer NOT NULL,
    "originUserId" integer NOT NULL,
    "relatedUserId" integer NOT NULL,
    CONSTRAINT "RelatedUser_pkey" PRIMARY KEY ("relatedId")
);

CREATE TABLE IF NOT EXISTS public."TreatmentHistory"
(
    "treatmentHistoryId" integer NOT NULL,
    "startDate" timestamp with time zone NOT NULL DEFAULT '2021-12-05 21:06:58.466+07'::timestamp with time zone,
    "endDate" timestamp with time zone,
    "statusF" smallint NOT NULL DEFAULT 0,
    "userId" integer NOT NULL,
    "isolationFacilityId" integer NOT NULL,
    CONSTRAINT "TreatmentHistory_pkey" PRIMARY KEY ("treatmentHistoryId")
);

CREATE TABLE IF NOT EXISTS public."User"
(
    "userId" integer NOT NULL,
    uuid uuid NOT NULL,
    fullname character varying(50) COLLATE pg_catalog."default" NOT NULL,
    "peopleId" character varying(12) COLLATE pg_catalog."default" NOT NULL,
    "DOB" timestamp with time zone DEFAULT '1970-01-01 07:00:00+07'::timestamp with time zone,
    "statusF" smallint NOT NULL DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "managerId" integer,
    "accountId" integer NOT NULL,
    "addressId" integer NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE IF NOT EXISTS public."Ward"
(
    id integer NOT NULL,
    name character varying(30) COLLATE pg_catalog."default" NOT NULL,
    prefix character varying(20) COLLATE pg_catalog."default" NOT NULL,
    "districtId" integer,
    CONSTRAINT "Ward_pkey" PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public."AccountHistory"
    ADD CONSTRAINT "AccountHistory_accountId_fkey" FOREIGN KEY ("accountId")
    REFERENCES public."Account" ("accountId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."Address"
    ADD CONSTRAINT "Address_wardId_fkey" FOREIGN KEY ("wardId")
    REFERENCES public."Ward" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."ConsumptionHistory"
    ADD CONSTRAINT "ConsumptionHistory_productPackageId_fkey" FOREIGN KEY ("productPackageId")
    REFERENCES public."ProductPackage" ("productPackageId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."ConsumptionHistory"
    ADD CONSTRAINT "ConsumptionHistory_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES public."User" ("userId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."District"
    ADD CONSTRAINT "District_provinceId_fkey" FOREIGN KEY ("provinceId")
    REFERENCES public."Province" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."IsolationFacility"
    ADD CONSTRAINT "IsolationFacility_addressId_fkey" FOREIGN KEY ("addressId")
    REFERENCES public."Address" ("addressId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."PaymentHistory"
    ADD CONSTRAINT "PaymentHistory_consumptionHistoryId_fkey" FOREIGN KEY ("consumptionHistoryId")
    REFERENCES public."ConsumptionHistory" ("consumptionHistoryId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;


ALTER TABLE IF EXISTS public."PaymentHistory"
    ADD CONSTRAINT "PaymentHistory_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES public."User" ("userId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."ProductImage"
    ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId")
    REFERENCES public."Product" ("productId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public."ProductInPackage"
    ADD CONSTRAINT "ProductInPackage_productId_fkey" FOREIGN KEY ("productId")
    REFERENCES public."Product" ("productId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public."ProductInPackage"
    ADD CONSTRAINT "ProductInPackage_productPackageId_fkey" FOREIGN KEY ("productPackageId")
    REFERENCES public."ProductPackage" ("productPackageId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public."RelatedUser"
    ADD CONSTRAINT "RelatedUser_originUserId_fkey" FOREIGN KEY ("originUserId")
    REFERENCES public."User" ("userId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."RelatedUser"
    ADD CONSTRAINT "RelatedUser_relatedUserId_fkey" FOREIGN KEY ("relatedUserId")
    REFERENCES public."User" ("userId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."TreatmentHistory"
    ADD CONSTRAINT "TreatmentHistory_isolationFacilityId_fkey" FOREIGN KEY ("isolationFacilityId")
    REFERENCES public."IsolationFacility" ("isolationFacilityId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."TreatmentHistory"
    ADD CONSTRAINT "TreatmentHistory_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES public."User" ("userId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."User"
    ADD CONSTRAINT "User_accountId_fkey" FOREIGN KEY ("accountId")
    REFERENCES public."Account" ("accountId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."User"
    ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId")
    REFERENCES public."Address" ("addressId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."User"
    ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId")
    REFERENCES public."Account" ("accountId") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public."Ward"
    ADD CONSTRAINT "Ward_districtId_fkey" FOREIGN KEY ("districtId")
    REFERENCES public."District" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;

END;
