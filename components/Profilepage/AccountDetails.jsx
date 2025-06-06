"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axiosInstance from "@/utils/AxiosInstance";
import toast, { Toaster } from "react-hot-toast";
import uploadToImgbb from "@/utils/UploadtoImgbb";

export default function AccountDetails({ userData }) {
  const [formData, setFormData] = useState({
    displayName: userData?.userName || "",
    email: userData?.email || "",
    PhoneNumber: userData?.phone != "None" ? userData?.phone : "",
    profilePic:
      userData?.profilePicture !== "None"
        ? userData.profilePicture
        : "https://cdn-icons-png.freepik.com/512/13014/13014933.png",
  });

  const [pic, setPic] = useState(null);
  const onDrop = useCallback((acceptedFiles) => {
    let file = acceptedFiles[0];
    if (file) {
      setPic(file);
    }
    setFormData((prev) => ({
      ...prev,
      profilePic: Object.assign(file, { preview: URL.createObjectURL(file) }),
    }));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Validate phone number
      if (formData.PhoneNumber && !/^\d{10}$/.test(formData.PhoneNumber)) {
        toast.error("Phone number must be exactly 10 digits");
        return;
      }

      // Validate required fields
      if (!formData.displayName) {
        toast.error("Display name is required");
        return;
      }

      let updatedFormData = { ...formData };

      // Only upload and update profile picture if a new one is selected
      if (pic) {
        const url = await uploadToImgbb(pic);
        if (!url) {
          toast.error("Failed to upload profile picture");
          return;
        }
        updatedFormData.profilePic = url;
      }

      const res = await axiosInstance.post("/user/edit-profile", updatedFormData);
      
      if (res.status === 200) {
        toast.success("Profile updated successfully");
        // setFormData(res.data.data);
        location.reload();
      } else {
        toast.error("Failed to update profile. Please try again later.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An error occurred while updating profile");
    }
  };

  return (
    // <div className="max-w-4xl mx-auto p-4 sm:p-6">
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden rounded-xl">
      <Toaster/>
      <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-blue-400 p-8 rounded-lg">
        <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
          <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          Account Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-10">
        {/* Profile Picture Upload */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <div className="relative group">
            <Avatar className="w-32 h-32 border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105">
              {formData.profilePic && formData.profilePic !== "None" ? (
                <AvatarImage
                  src={formData.profilePic.preview || formData.profilePic}
                  alt="Profile"
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-900 text-white text-2xl">
                  {userData?.userName?.substring(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm text-gray-700 bg-white px-4 py-2 rounded-full shadow-lg">
                update
              </span>
            </div>
          </div>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 w-full sm:w-72 text-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all duration-300"
          >
            <input {...getInputProps()} />
            <p className="text-sm text-gray-700 font-medium">
              Drop your image here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supports: JPG, PNG (Max 5MB)
            </p>
          </div>
        </div>

        {/* Form Fields with enhanced styling */}
        <div className="space-y-8">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Display Name *
            </Label>
            <Input
              name="displayName"
              value={formData.displayName}
              onChange={(e) => handleChange(e)}
              className="bg-gray-50 text-gray-600 cursor-text"
            />
            <p className="text-xs text-gray-500">
              This name will be displayed in your account section and reviews.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Email Address *
            </Label>
            <Input
              name="email"
              value={formData.email}
              disabled
              className="bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Phone Number *
            </Label>
            <Input
              name="PhoneNumber"
              min={10}
              max={10}
              value={formData.PhoneNumber}
              onChange={(e) => handleChange(e)}
              className="bg-gray-50 text-gray-600 focus:border-0"
            />
          </div>

          {/* Password Section with enhanced styling */}
          {/* <div className="pt-8 border-t">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-black/5 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                Change Password
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Current Password</Label>
                  <Input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="border-gray-200 focus:ring-2 focus:ring-black focus:border-black transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">New Password</Label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="border-gray-200 focus:ring-2 focus:ring-black focus:border-black transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="border-gray-200 focus:ring-2 focus:ring-black focus:border-black transition-all duration-300"
                  />
                </div>
              </div>
            </div> */}

          {/* Enhanced Submit Button */}
          <div className="pt-8">
            <Button
              onClick={handleSubmit}
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white py-7 transition-all duration-300 rounded-xl text-lg font-medium shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    // </div>
  );
}
