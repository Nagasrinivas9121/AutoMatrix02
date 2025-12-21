import React, { useEffect, useState } from "react";
import api from "../api/api";

import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import DarkModeToggle from "../components/DarkModeToggle";
import useToast from "../hooks/useToast";

export default function Settings() {
  const toast = useToast();

  // --------------------
  // PROFILE STATE
  // --------------------
  const [profile, setProfile] = useState({
    name: "",
    orgName: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // --------------------
  // PASSWORD STATE
  // --------------------
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // --------------------
  // LOAD PROFILE
  // --------------------
  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) =>
        setProfile({
          name: res.data?.name || "",
          orgName: res.data?.orgName || "",
          email: res.data?.email || "",
        })
      )
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  // --------------------
  // VALIDATION
  // --------------------
  const validateProfile = () => {
    const errors = {};
    if (profile.name.trim().length < 2)
      errors.name = "Name must be at least 2 characters.";
    if (profile.orgName.trim().length < 2)
      errors.orgName = "Organization name must be at least 2 characters.";
    return errors;
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.currentPassword)
      errors.currentPassword = "Current password is required.";
    if (passwordForm.newPassword.length < 6)
      errors.newPassword = "Password must be at least 6 characters.";
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
    return errors;
  };

  // --------------------
  // UPDATE PROFILE
  // --------------------
  const updateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setValidationErrors({});
    setError("");

    const errors = validateProfile();
    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      setSaving(false);
      return;
    }

    try {
      await api.put("/auth/update-profile", profile);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
      setError("Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // --------------------
  // CHANGE PASSWORD
  // --------------------
  const changePassword = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setPasswordSaving(true);

    const errors = validatePassword();
    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      setPasswordSaving(false);
      return;
    }

    try {
      await api.put("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Password updated");
      setPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Failed to update password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading settings..." />;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-50 dark:bg-slate-900 rounded-xl animate-fadeIn">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Settings
      </h1>

      {error && <ErrorMessage message={error} />}

      {/* PROFILE */}
      <section className="bg-white dark:bg-slate-800 border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>

        <form onSubmit={updateProfile} className="space-y-4">
          <div>
            <input
              className="w-full p-3 border rounded dark:bg-slate-700"
              placeholder="Your Name"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div>
            <input
              className="w-full p-3 border rounded dark:bg-slate-700"
              placeholder="Organization Name"
              value={profile.orgName}
              onChange={(e) =>
                setProfile({ ...profile, orgName: e.target.value })
              }
            />
            {validationErrors.orgName && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.orgName}
              </p>
            )}
          </div>

          <input
            disabled
            className="w-full p-3 border rounded bg-slate-100 dark:bg-slate-700 text-slate-400"
            value={profile.email}
          />

          <button
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      {/* SECURITY */}
      <section className="bg-white dark:bg-slate-800 border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <button
          onClick={() => setPasswordModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Change Password
        </button>
      </section>

      {/* APPEARANCE */}
      <section className="bg-white dark:bg-slate-800 border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <DarkModeToggle />
      </section>

      {/* PASSWORD MODAL */}
      {passwordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setPasswordModal(false)}
          />

          <div className="relative bg-white dark:bg-slate-800 p-6 w-full max-w-md rounded-xl shadow-xl z-10">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>

            <form onSubmit={changePassword} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full p-3 border rounded dark:bg-slate-700"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
              />
              {validationErrors.currentPassword && (
                <p className="text-red-500 text-sm">
                  {validationErrors.currentPassword}
                </p>
              )}

              <input
                type="password"
                placeholder="New Password"
                className="w-full p-3 border rounded dark:bg-slate-700"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
              {validationErrors.newPassword && (
                <p className="text-red-500 text-sm">
                  {validationErrors.newPassword}
                </p>
              )}

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 border rounded dark:bg-slate-700"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {validationErrors.confirmPassword}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPasswordModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  disabled={passwordSaving}
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
                >
                  {passwordSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}