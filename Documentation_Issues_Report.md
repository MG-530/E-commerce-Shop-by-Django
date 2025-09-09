# Documentation Issues Report

After thoroughly reviewing all documentation files and cross-referencing them with the actual codebase, I've identified several inconsistencies and errors that need to be corrected.

## 🔍 **Critical Issues Found**

### 1. **Authentication Method Inconsistency**

**Files Affected:**
- `/docs/Backend_API_Documentation.md` (Lines 19, 27-41)
- `/README.md` (Lines 127-133)

**Issue:**
- Documentation claims the system uses **JWT token authentication**
- Actual implementation uses **DRF Token Authentication** (not JWT)

**Evidence:**
- `settings.py` line 150-151: Uses `'rest_framework.authentication.TokenAuthentication'`
- No JWT configuration found in settings
- API endpoint `/api/users/api-token-auth/` returns simple token, not JWT

**Fix Required:**
Replace all references to "JWT token" with "DRF Token" or "Token Authentication"

---

### 2. **User Model Field Discrepancies**

**Files Affected:**
- `/docs/Model_Documentation_by_Application.md` (Line 18)
- `/DBML/DBML.dbml` (Lines 5-14)
- `/DBML/README.md` (Lines 179-189)

**Issue:**
- Documentation shows `username` field exists in User model
- **Actual code:** `username = None` (field is explicitly removed)
- User model uses `email` as the primary authentication field

**Evidence:**
- `users/models.py` line 36: `username = None  # Remove the username field`
- `users/models.py` line 43: `USERNAME_FIELD = 'email'`

**Fix Required:**
Remove `username` field from all documentation and replace with `email` as the primary identifier

---

### 3. **Missing Shipment Address Field**

**Files Affected:**
- `/DBML/DBML.dbml` (Line 126)
- `/DBML/README.md` (Line 295)

**Issue:**
- DBML shows `Shipment_Address_ID` field in Shipment table
- **Actual code:** No such field exists in Shipment model

**Evidence:**
- `orders/models.py` lines 59-68: Shipment model has no address field
- Only has: `order`, `shipment_date`, `carrier`, `tracking_number`, `status`

**Fix Required:**
Remove `Shipment_Address_ID` field from DBML schema

---

### 4. **Incorrect Reference in Return Model**

**Files Affected:**
- `/code/return/models.py` (Line 16)

**Issue:**
- Code references `self.order.Order_ID` but Order model uses default Django `id` field
- This will cause AttributeError at runtime

**Evidence:**
- `orders/models.py`: Order model doesn't define `Order_ID` field
- Uses Django's default `id` primary key

**Fix Required:**
Change `self.order.Order_ID` to `self.order.id`

---

### 5. **Inconsistent Primary Key Naming**

**Files Affected:**
- `/docs/Model_Documentation_by_Application.md`
- `/DBML/DBML.dbml`

**Issue:**
- Documentation uses custom primary key names (e.g., `User_ID`, `Product_ID`)
- **Actual code:** Most models use Django's default `id` field
- Only `User` and `Warehouse` models have custom primary keys

**Evidence:**
- `users/models.py` line 35: `User_ID = models.AutoField(primary_key=True)`
- `inventory/models.py` line 7: `Warehouse_ID = models.AutoField(primary_key=True)`
- All other models use default Django `id` field

**Fix Required:**
Update documentation to reflect actual primary key field names

---

### 6. **Bundle Product Price Adjustment Data Type**

**Files Affected:**
- `/DBML/DBML.dbml` (Line 199)

**Issue:**
- DBML shows `Price_adjustment int`
- **Actual code:** `price_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=0)`

**Evidence:**
- `catalog/models.py` line 84: Uses DecimalField, not IntegerField

**Fix Required:**
Change data type from `int` to `decimal` in DBML

---

### 7. **Vendor Model Structure Mismatch**

**Files Affected:**
- `/docs/Model_Documentation_by_Application.md` (Line 104)
- `/DBML/DBML.dbml` (Line 204)

**Issue:**
- Documentation shows `Vendor_ID` as separate primary key
- **Actual code:** Uses `OneToOneField` with User as primary key

**Evidence:**
- `vendor/models.py` line 7: `user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)`

**Fix Required:**
Update documentation to show correct relationship structure

---

### 8. **API Endpoint Inconsistencies**

**Files Affected:**
- `/docs/Backend_API_Documentation.md` (Line 34-36)

**Issue:**
- Login endpoint shows `"username"` in request payload
- **Actual implementation:** Uses email for authentication

**Evidence:**
- `users/models.py` line 43: `USERNAME_FIELD = 'email'`

**Fix Required:**
Change login payload example from `"username"` to `"email"`

---

### 9. **Missing Timestamp Field**

**Files Affected:**
- `/DBML/DBML.dbml` (Line 71)

**Issue:**
- DBML missing `timestamp` field in `Inventory_Transaction` table
- **Actual code:** Has `timestamp = models.DateTimeField(auto_now_add=True)`

**Evidence:**
- `inventory/models.py` line 41: Field exists in actual model

**Fix Required:**
Add `timestamp` field to DBML schema

---

## 📊 **Summary of Required Actions**

### High Priority (Will cause runtime errors):
1. Fix `Order_ID` reference in return model
2. Correct authentication method documentation
3. Remove username field references

### Medium Priority (Documentation accuracy):
4. Fix primary key naming inconsistencies
5. Correct Vendor model structure
6. Update API payload examples
7. Fix data type mismatches

### Low Priority (Schema completeness):
8. Remove non-existent fields from DBML
9. Add missing fields to DBML

---

## 🛠️ **Recommended Fix Order**

1. **Code fixes first:** Fix the `Order_ID` reference that will cause runtime errors
2. **Authentication docs:** Update all JWT references to Token Authentication
3. **User model docs:** Remove username field from all documentation
4. **Schema updates:** Align DBML with actual model structure
5. **API docs:** Update request/response examples to match implementation

---

## ✅ **Files That Are Accurate**

- `/App_Explanations.md` - Correctly describes the business logic
- Most model field definitions are accurate (except noted issues above)
- URL routing structure matches actual implementation
- App organization and relationships are correctly documented

This report ensures your documentation accurately reflects the actual codebase implementation.