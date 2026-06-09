# دليل تطوير تطبيق أندرويد لـ "إلكترو صيانة" 📱🛠️

يرشدك هذا الملف لتنفيذ تطبيق أندرويد متكامل ومطابق لميزات الموقع الإلكتروني باستخدام أحدث التقنيات البرمجة الرسمية للأندرويد: **Kotlin** و **Jetpack Compose**.

---

## 1. البنية التقنية للتطبيق (Tech Stack)

لتطوير تطبيق سريع، تفاعلي، ومطابق لواجهات الويب، يوصى بالاعتماد على:
-   **اللغة المصدر**: Kotlin (الإصدار 1.9+).
-   **واجهة المستخدم (UI وطبقة العينات)**: Jetpack Compose مع سمات وثيمات **Material Design 3**.
-   **إدارة قواعد البيانات المحلية (Offline Storage)**: مكتبة **Room Database** (وهي تغليف رسمي فوق SQLite) لحفظ المنتجات، وحالات الصيانة حتى في حالة عدم الاتصال.
-   **التعامل مع الصور والملحقات**: استخدام الـ `URI` الخاص بنظام الملفات، ومعالجة الصور عبر **Coil** (مكتبة كوتلن السريعة للشحن).
-   **الاتصال الشبكي والتحديثات**: مكتبة **Retrofit** للاتصال بالخادم حياً في المراحل المتقدمة.

---

## 2. بنية المجلدات وهيكل الكود (Architecture)

نعتمد على معمارية **MVVM** (Model-View-ViewModel) التي تفصل منطق العمل عن تصميم الواجهات:

*   `data/`: يحتوي على الكائنات وقواعد البيانات.
    *   `model/Product.kt` (كائن المنتجات)
    *   `model/RepairRequest.kt` (كائن طلبات الصيانة وأعطاب الأجهزة)
    *   `local/AppDatabase.kt` (قاعدة بيانات Room)
    *   `local/ProductDao.kt` و `local/RepairDao.kt` (مستندات الاستعلامات)
*   `ui/`: يحتوي على واجهات العرض وموجه الصوت.
    *   `theme/` (مجلد تخصيص الألوان والسمات لتطابق المظهر المسائي والمستقبلي)
    *   `components/` (العناصر الصغيرة المعاد استخدامها مثل الكروت، الحقول، أزرار الاختيار)
    *   `screens/` (الواجهات الكاملة للتطبيق)
*   `viewmodel/`: ينظم العمليات وحفظ الحالة عبر التدوير والتنقل.
    *   `MainViewModel.kt`

---

## 3. تعريف الكتل البرمجية الأساسية (Core Code Snippets)

### أ. كائن معطيات المنتجات بالمنصة (`Product.kt`)

```kotlin
package com.electrotech.repair.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "products")
data class Product(
    @PrimaryKey val id: String,
    val name: String,
    val category: String, // phone, laptop, phone_accessory, laptop_accessory
    val price: Double,
    val description: String,
    val imageUrl: String,
    val specs: List<String>, // يتم تحويلها عبر TypeConverter في Room
    val inStock: Boolean,
    val isFeatured: Boolean = false
)
```

### ب. كائن معطيات طلبات الصيانة بالمنصة (`RepairRequest.kt`)

```kotlin
package com.electrotech.repair.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "repair_requests")
data class RepairRequest(
    @PrimaryKey val id: String,
    val customerName: String,
    val customerPhone: String,
    val deviceModel: String,
    val category: String,
    val description: String,
    val images: List<String>, // مسارات لصور ملتقطة بالهاتف
    val status: String,       // pending, received, diagnostic, repairing, completed, collected
    val cost: Double? = null,
    val adminNotes: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)
```

---

## 4. تنفيذ ميزة رفع صور الأعطاب (Camera & Gallery Input) 📸

لعل أهم متطلبات التطبيق هي كتم ميزة إمكانية المتصفح لوضع صور للجهاز ووصف العطب. في الأندرويد نستخدم Launchers المدمجة الحديثة:

```kotlin
// في واجهة Jetpack Compose داخل RepairFormScreen
var selectedImageUris by remember { mutableStateOf<List<Uri>>(emptyList()) }

// منشطات المعرض الفني واختيار ملف يدوي
val galleryLauncher = rememberLauncherForActivityResult(
    contract = ActivityResultContracts.GetMultipleContents()
) { uris: List<Uri> ->
    selectedImageUris = selectedImageUris + uris
}

// زر الالتقاط السريع بالكاميرا الحرة
val context = LocalContext.current
val cameraLauncher = rememberLauncherForActivityResult(
    contract = ActivityResultContracts.TakePicturePreview()
) { bitmap ->
    if (bitmap != null) {
        // تحويل صورة الكاميرا البيتماب لمسار محلي وتخزينه
        val uri = saveBitmapToCache(context, bitmap)
        selectedImageUris = selectedImageUris + listOf(uri)
    }
}
```

---

## 5. واجهات المستخدم بـ Jetpack Compose (UI Sections)

### أ. تصميم نموذج إصلاح الأعطاب والمظاهر بالتطبيق

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RepairFormScreen(
    onFormSubmitted: (name: String, phone: String, model: String, desc: String, images: List<Uri>) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var model by remember { mutableStateOf("") }
    var desc by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("طلب تذاكر الإصلاح والصيانة", style = MaterialTheme.typography.titleLarge)
        
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("الاسم الكامل") },
            modifier = Modifier.fillMaxWidth()
        )
        
        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("رقم جوال للتواصل") },
            modifier = Modifier.fillMaxWidth()
        )
        
        OutlinedTextField(
            value = model,
            onValueChange = { model = it },
            label = { Text("طراز الجهاز بالتحديد") },
            modifier = Modifier.fillMaxWidth()
        )
        
        OutlinedTextField(
            value = desc,
            onValueChange = { desc = it },
            label = { Text("اشرح مظهر الخلل أو العطب هنا...") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 3
        )

        // حاوية اختيار المرفقات الصور
        DragAndDropFileZoneMock()

        Button(
            onClick = { onFormSubmitted(name, phone, model, desc, selectedImageUris) },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("إرسال التذكرة وتسجيل البيانات")
        }
    }
}
```

---

## 6. تتبع الطلبات ومطابقة حالة الصيانة للعملاء

يمكن تصميم مسار تتبع بصري رأسي (Vertical Stepper) يطابق بالتمام الخط الموضح بالموقع الإلكتروني:

```kotlin
@Composable
fun TrackingStepper(currentStatus: String) {
    val steps = listOf("pending", "received", "diagnostic", "repairing", "completed", "collected")
    val labels = listOf("قيد المراجعة", "تم الاستلام في الورشة", "قيد التشخيص", "جاري الإصلاح", "جاهز للاستلام", "تم التسليم")
    
    val currentIndex = steps.indexOf(currentStatus).coerceAtLeast(0)

    Column(modifier = Modifier.padding(16.dp)) {
        steps.forEachIndexed { index, step ->
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(vertical = 8.dp)
            ) {
                // دائرة الحالة ومطابقتها الملونة
                Box(
                    modifier = Modifier
                        .size(24.dp)
                        .background(
                            color = if (index <= currentIndex) Color.Green else Color.Gray,
                            shape = CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    if (index < currentIndex) {
                        Icon(Icons.Default.Check, contentDescription = "Done", tint = Color.White, modifier = Modifier.size(16.dp))
                    }
                }
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = labels[index],
                    style = if (index == currentIndex) MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold) else MaterialTheme.typography.bodyMedium,
                    color = if (index <= currentIndex) Color.White else Color.Gray
                )
            }
        }
    }
}
```

---

## 7. لوحة إدارة المسؤول المتنقلة (Admin View)

تماماً مثل لوحة الويب، يحتوي تطبيق أندرويد على صفحة مخفية أو يتم حمايتها بـ Passcode مخصص (`1234`) يمنح المسؤول قدرة على:
1.  **لوحة الصيانة والـ CRM**: تحديث حقول `status` وحقول `cost` و `adminNotes` لكل طلب إصلاح في قاعدة البيانات المحلية.
2.  **لوحة المنتجات**: إضافة منتجات جديدة وتحديث توفر الأسهم بالمعرض وحذف الموديلات القديمة.
