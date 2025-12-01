<template>
    <div class="">
        <!-- HEADER + BUTTON -->
        <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold">Quản lý Nhà Xe</h1>

            <el-button type="primary" @click="openCreate">
                Thêm nhà xe
            </el-button>
        </div>


        <!-- TABLE -->
        <el-table v-loading="loadingData" :data="filterTableData" border class="mt-4"
            style="margin-top: 10px ; width: 100%">

            <el-table-column type="index" label="#" width="50" />

            <el-table-column label="Thông tin công ty">
                <template #default="scope">
                    <div class="text-black">{{ scope.row.company_name }}</div>
                    <div class="text-sm text-gray-800">({{ scope.row.company_short_name }}) - ({{
                        scope.row.company_code }})</div>
                    <div>MST: {{ scope.row.tax_code }}</div>
                    <div>GPKD: {{ scope.row.business_license_number }}</div>
                </template>
            </el-table-column>
            <el-table-column label="Thông tin liên hệ">
                <template #default="scope">
                    <div class="text-black">{{ scope.row.legal_representative }}</div>
                    <div>{{ scope.row.email }}</div>
                    <div>{{ scope.row.phone }}</div>
                    <div>{{ scope.row.head_office_address }}</div>

                </template>
            </el-table-column>
            <el-table-column label="Thông tin ngân hàng">
                <template #default="scope">
                    <div class="text-black">{{ scope.row.bank_name }}</div>
                    <div>STK: {{ scope.row.bank_account_number }}</div>
                    <div>Chủ tài khoản: {{ scope.row.bank_account_name }}</div>
                </template>
            </el-table-column>
            <el-table-column label="Trạng thái">
                <template #default="scope">
                    <div>
                        <el-tag :type="scope.row.status ? 'success' : 'danger'" effect="light">
                            {{ scope.row.status ? 'Đang hoạt động' : 'Ngưng hoạt động' }}
                        </el-tag>
                    </div>
                    <div>Tạo: {{ formatDate(scope.row.created_at) }}</div>
                    <div>Cập nhật: {{ formatDate(scope.row.updated_at) }}</div>
                </template>
            </el-table-column>

            <el-table-column width="150" align="center">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Tìm kiếm" />
                </template>
                <template #default="scope">
                    <el-dropdown trigger="click">
                        <el-button :icon="More" circle />
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleManageRoute(scope.$index, scope.row)">Tuyến</el-dropdown-item>
                                <el-dropdown-item @click="handleManageAccount(scope.$index, scope.row)">Tài khoản</el-dropdown-item>
                                <el-dropdown-item @click="handleEdit(scope.$index, scope.row)">
                                    Chỉnh sửa
                                </el-dropdown-item>
                                <el-dropdown-item @click="handleDelete(scope.$index, scope.row)">
                                    Xóa
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>

        <!-- DIALOG -->
        <el-dialog v-model="dialogVisible" width="600px" :title="isEdit ? 'Chỉnh sửa nhà xe' : 'Thêm nhà xe'">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="200px">

                <el-form-item label="Tên công ty" prop="company_name">
                    <el-input v-model="form.company_name" />
                </el-form-item>

                <el-form-item label="Tên viết tắt" prop="company_short_name">
                    <el-input v-model="form.company_short_name" />
                </el-form-item>

                <el-form-item label="Mã số thuế" prop="tax_code">
                    <el-input v-model="form.tax_code" />
                </el-form-item>

                <el-form-item label="Số giấy phép KD" prop="business_license_number">
                    <el-input v-model="form.business_license_number" />
                </el-form-item>

                <el-form-item label="Email" prop="email">
                    <el-input v-model="form.email" type="email" />
                </el-form-item>

                <el-form-item label="Số điện thoại" prop="phone">
                    <el-input v-model="form.phone" />
                </el-form-item>

                <el-form-item label="Người đại diện" prop="legal_representative">
                    <el-input v-model="form.legal_representative" />
                </el-form-item>

                <el-form-item label="Địa chỉ trụ sở chính" prop="head_office_address">
                    <el-input v-model="form.head_office_address" type="textarea" :rows="3" />
                </el-form-item>

                <el-form-item label="Mã công ty" prop="company_code">
                    <el-input v-model="form.company_code" />
                </el-form-item>

                <el-form-item label="URL Logo" prop="url_logo">
                    <el-input v-model="form.url_logo" />
                </el-form-item>

                <el-form-item label="Tên ngân hàng" prop="bank_name">
                    <el-input v-model="form.bank_name" />
                </el-form-item>

                <el-form-item label="Số tài khoản" prop="bank_account_number">
                    <el-input v-model="form.bank_account_number" />
                </el-form-item>

                <el-form-item label="Chủ tài khoản" prop="bank_account_name">
                    <el-input v-model="form.bank_account_name" />
                </el-form-item>

                <el-form-item label="Kích hoạt">
                    <el-switch v-model="form.status" />
                </el-form-item>

            </el-form>

            <template #footer>
                <el-button @click="handleClose">Hủy</el-button>
                <el-button type="primary" @click="submitForm">Lưu</el-button>
            </template>
        </el-dialog>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { Company } from '@/types/company/company.interface'
import { companyService } from '@/services/identity-service/company.service'
import { formatDate } from '@/utils/date'
import { More } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const dialogVisible = ref(false)
const isEdit = ref(false) // xác định chế độ
const editIndex = ref<number | null>(null)

// Danh sách nhà xe
const tableData = ref<Company[]>([]);

// Form
const formRef = ref<FormInstance>()
const form = ref<Company>({
    id: undefined,
    status: false,
    company_name: undefined,
    company_short_name: undefined,
    tax_code: undefined,
    business_license_number: undefined,
    email: undefined,
    phone: undefined,
    legal_representative: undefined,
    head_office_address: undefined,
    company_code: undefined,
    url_logo: undefined,
    bank_name: undefined,
    bank_account_number: undefined,
    bank_account_name: undefined
})

// Validation rules
const rules = reactive<FormRules>({
    company_name: [
        { required: true, message: 'Vui lòng nhập tên công ty', trigger: 'blur' }
    ],
    company_short_name: [
        { required: true, message: 'Vui lòng nhập tên công ty', trigger: 'blur' }
    ],
    tax_code: [
        { required: true, message: 'Vui lòng nhập mã số thuế', trigger: 'blur' }
    ],
    business_license_number: [
        { required: true, message: 'Vui lòng nhập số giấy phép kinh doanh', trigger: 'blur' }
    ],
    email: [
        { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
        { type: 'email', message: 'Email không hợp lệ', trigger: ['blur', 'change'] }
    ],
    phone: [
        { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' }
    ],
    legal_representative: [
        { required: true, message: 'Vui lòng nhập người đại diện', trigger: 'blur' }
    ],
    company_code: [
        { required: true, message: 'Vui lòng nhập mã công ty', trigger: 'blur' }
    ],

})
const handleClose = () => {
    formRef.value?.resetFields()
    dialogVisible.value = false
}

/* -------------------
      THÊM MỚI
--------------------*/
const openCreate = () => {
    isEdit.value = false
    editIndex.value = null
    form.value = {
        id: undefined,
        status: false,
        company_name: undefined,
        company_short_name: undefined,
        tax_code: undefined,
        business_license_number: undefined,
        email: undefined,
        phone: undefined,
        legal_representative: undefined,
        head_office_address: undefined,
        company_code: undefined,
        url_logo: undefined,
        bank_name: undefined,
        bank_account_number: undefined,
        bank_account_name: undefined
    }


    dialogVisible.value = true
}

/* -------------------
      SỬA
--------------------*/
const handleEdit = (index: number, row: Company) => {
    isEdit.value = true
    editIndex.value = index
    form.value = { ...row }


    dialogVisible.value = true
}
const router = useRouter();
const handleManageAccount = (index: number, row: Company) => {
    router.push({
    name: 'taikhoan',
    query: {
      companyId: row.id?.toString() || '',
      name: row.company_short_name || ''
    }
  });
}
const handleManageRoute = (index: number, row: Company) => {
    router.push({
    name: 'tuyen',
    query: {
      companyId: row.id?.toString() || '',
      name: row.company_short_name || ''
    }
  });
}
/* -------------------
      LƯU FORM
--------------------*/
const submitForm = () => {
    if (!formRef.value) return

    formRef.value.validate(async (valid) => {
        if (!valid) return

        if (isEdit.value && editIndex.value !== null) {
            console.log(form.value);
            const res = await companyService.API_Update(form.value.id!, form.value);
            if (res.success) {
                ElMessage.success('Cập nhật công ty thành công');
                tableData.value[editIndex.value] = res.result!;
                dialogVisible.value = false;
            } else {
                ElMessage.error(res.message || 'Cập nhật công ty thất bại');
            }
        } else {
            console.log(form.value);
            const res = await companyService.API_Create(form.value);

            if (res.success) {
                ElMessage.success('Tạo công ty thành công');
                tableData.value.push(res.result!);
                dialogVisible.value = false;
            } else {
                ElMessage.error(res.message || 'Tạo công ty thất bại');
            }

        }

        // dialogVisible.value = false
    })
}

/* -------------------
      XÓA
--------------------*/
const handleDelete = async (index: number, row: Company) => {
    try {
        const res = await companyService.API_Delete(row.id!);
        if (res.success) {
            ElMessage.success('Xóa công ty thành công');
            tableData.value.splice(index, 1);
        } else {
            ElMessage.error(res.message || 'Xóa công ty thất bại');
        }
    } catch (error) {
        ElMessage.error('Xóa công ty thất bại');
    }
}
const loadingData = ref(false);
const fetchBusList = async () => {
    loadingData.value = true;
    try {
        const res = await companyService.API_GetAll();
        if (res.success && res.result) {
            tableData.value = res.result;
        } else {
            ElMessage.error('Không thể tải danh sách nhà xe');
        }
    } catch (error) {
        ElMessage.error('Không thể tải danh sách nhà xe');
    } finally {
        loadingData.value = false;
    }
}
const search = ref('')
const filterTableData = computed(() =>
    tableData.value.filter(
        (data) =>
            !search.value ||
            (data.company_name && data.company_name.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.company_short_name && data.company_short_name.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.company_code && data.company_code.toLowerCase().includes(search.value.toLowerCase()))
    )
)
onMounted(() => {
    fetchBusList();
})
</script>

<style scoped></style>
