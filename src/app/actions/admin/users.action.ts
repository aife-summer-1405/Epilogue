"use server";

import instance from "@/lib/http/interceptors";
import type {
  ActionResult,
  AdminUserItem,
  GetAdminUsersResponse,
  UpdateAdminUserPayload,
  UpdateAdminUserRolePayload,
} from "@/core/types/userManagement.types";

function cleanUserPayload(payload: UpdateAdminUserPayload) {
  const cleaned: Record<string, unknown> = {
    email: payload.email,
    fullName: payload.fullName,
    firstName: payload.firstName,
    lastName: payload.lastName,
    phoneNumber: payload.phoneNumber || null,
    emailVerified: Boolean(payload.emailVerified),
    profilePicture: payload.profilePicture || null,
  };

  if (payload.membershipDate) {
    cleaned.membershipDate = payload.membershipDate;
  } else {
    cleaned.membershipDate = null;
  }

  return cleaned;
}

export async function getAdminUsersAction(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ActionResult<GetAdminUsersResponse>> {
  try {
    const response = await instance.get("/admin/users", {
      params,
      headers: {
        tokenNeeded: "true",
      },
    });

    const raw = response?.data ?? response;
    const usersList: AdminUserItem[] = Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw)
        ? raw
        : [];

    const totalCount =
      typeof raw?.totalCount === "number" ? raw.totalCount : usersList.length;

    return {
      success: true,
      data: {
        data: usersList,
        totalCount,
      },
    };
  } catch (error: any) {
    console.error("Get Admin Users Error:", error?.response?.data || error?.message);
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "خطا در دریافت لیست کاربران",
    };
  }
}

export async function getAdminUserByIdAction(
  userId: string
): Promise<ActionResult<AdminUserItem>> {
  try {
    try {
      const singleRes = await instance.get(`/admin/users/${userId}`, {
        headers: { tokenNeeded: "true" },
      });
      const singleUser = singleRes?.data?.data ?? singleRes?.data;
      if (singleUser && singleUser.id) {
        return { success: true, data: singleUser };
      }
    } catch {
    }

    const listRes = await getAdminUsersAction({ limit: 500 });
    if (listRes.success && listRes.data) {
      const found = listRes.data.data.find((u) => String(u.id) === String(userId));
      if (found) {
        return { success: true, data: found };
      }
    }

    return {
      success: false,
      message: "کاربر مورد نظر یافت نشد",
    };
  } catch (error: any) {
    console.error("Get User By ID Error:", error?.response?.data || error?.message);
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "خطا در دریافت اطلاعات کاربر",
    };
  }
}

export async function updateAdminUserAction(
  userId: string,
  payload: UpdateAdminUserPayload
): Promise<ActionResult<AdminUserItem>> {
  const body = cleanUserPayload(payload);

  try {
    let response: any;
    try {
      response = await instance.patch(`/admin/users/${userId}`, body, {
        headers: {
          tokenNeeded: "true",
        },
      });
    } catch (patchError: any) {
      const status = patchError?.response?.status;
      if (status === 404 || status === 405) {
        response = await instance.put(`/admin/users/${userId}`, body, {
          headers: {
            tokenNeeded: "true",
          },
        });
      } else {
        throw patchError;
      }
    }

    const resData = response?.data ?? response;
    const updatedUser =
      resData?.data && typeof resData.data === "object"
        ? resData.data
        : undefined;

    return {
      success: true,
      data: updatedUser,
      message: "اطلاعات کاربر با موفقیت ویرایش شد",
    };
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 200) {
      return {
        success: true,
        message: "اطلاعات کاربر با موفقیت ویرایش شد",
      };
    }

    console.error(
      "Update User Error:",
      error?.response?.data || error?.message
    );
    return {
      success: false,
      message: "خطا در بروزرسانی اطلاعات کاربر",
    };
  }
}

export async function deleteAdminUserAction(
  userId: string
): Promise<ActionResult<null>> {
  try {
    await instance.delete(`/admin/users/${userId}`, {
      headers: {
        tokenNeeded: "true",
      },
    });

    return {
      success: true,
      data: null,
      message: "حساب کاربری با موفقیت حذف شد",
    };
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 200 || status === 201 || status === 204) {
      return {
        success: true,
        data: null,
        message: "حساب کاربری با موفقیت حذف شد",
      };
    }

    console.error(
      "Delete User Error:",
      error?.response?.data || error?.message
    );
    return {
      success: false,
      message: "خطا در حذف حساب کاربر",
    };
  }
}

export async function updateAdminUserRoleAction(
  userId: string,
  payload: UpdateAdminUserRolePayload
): Promise<ActionResult<AdminUserItem>> {
  try {
    let response: any;
    try {
      response = await instance.patch(`/admin/users/${userId}/role`, payload, {
        headers: {
          tokenNeeded: "true",
        },
      });
    } catch (patchError: any) {
      const status = patchError?.response?.status;
      if (status === 404 || status === 405) {
        response = await instance.put(`/admin/users/${userId}/role`, payload, {
          headers: {
            tokenNeeded: "true",
          },
        });
      } else {
        throw patchError;
      }
    }

    const resData = response?.data ?? response;
    const updatedUser =
      resData?.data && typeof resData.data === "object"
        ? resData.data
        : undefined;

    return {
      success: true,
      data: updatedUser,
      message: "نقش کاربر با موفقیت تغییر کرد",
    };
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 200 || status === 201 || status === 204) {
      return {
        success: true,
        message: "نقش کاربر با موفقیت تغییر کرد",
      };
    }

    console.error(
      "Update User Role Error:",
      error?.response?.data || error?.message
    );
    return {
      success: false,
      message: "خطا در تغییر نقش کاربر",
    };
  }
}