// ============================================================
// COMPLETE PROFILE PAGE — src/pages/CompleteProfilePage.tsx
// Shown after first login/signup if the user hasn't completed
// their profile yet. Collects name, avatar, bio, and skills.
// On completion, shows a small support QR code popup.
// ============================================================

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Check, ArrowRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import gpayQR from "@/assets/gpay-qr.jpg";

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, saveProfile } = useAuth();

  // Profile fields
  const [name, setName] = useState(() => localStorage.getItem("pymaster_name") || user?.displayName || "");
  const [bio, setBio] = useState(() => localStorage.getItem("pymaster_bio") || "");
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem("pymaster_avatar") || "");
  const [skills, setSkills] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("pymaster_skills") || "[]");
    } catch {
      return [];
    }
  });
  const [showQR, setShowQR] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const skillOptions = ["Python Basics", "Data Structures", "Web Development", "Machine Learning", "Data Science", "Automation", "Game Dev", "API Development"];

  // Redirect if profile is already complete
  useEffect(() => {
    if (profile?.profileComplete) {
      navigate("/dashboard");
    }
  }, [navigate, profile?.profileComplete]);

  useEffect(() => {
    if (!profile) return;
    setName(profile.displayName || user?.displayName || "");
    setBio(profile.bio);
    setProfilePic(profile.avatarUrl);
    setSkills(profile.skills);
  }, [profile, user?.displayName]);

  const handlePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleSkill = (skill: string) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleComplete = async () => {
    if (!name.trim()) {
      toast({ title: "Name required", description: "Please enter your display name.", variant: "destructive" });
      return;
    }

    try {
      await saveProfile({
        displayName: name.trim(),
        bio: bio.trim(),
        avatarUrl: profilePic,
        skills,
        profileComplete: true,
      });
    } catch (error) {
      toast({
        title: "Profile Save Failed",
        description: error instanceof Error ? error.message : "We couldn't save your profile.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "🎉 Profile Complete!", description: "Welcome to PyMaster! Let's start coding." });

    // Show small support QR popup briefly
    setShowQR(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 5000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-sm text-muted-foreground">Tell us about yourself so we can personalize your learning experience</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg space-y-5">
          {/* Avatar Upload */}
          <div className="flex justify-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="w-24 h-24 border-2 border-primary">
                {profilePic ? <AvatarImage src={profilePic} alt="Profile" /> : null}
                <AvatarFallback className="text-3xl bg-primary/20">
                  {name ? name[0]?.toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-foreground" />
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePicUpload} className="hidden" />
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="bio">Short Bio</Label>
            <Input
              id="bio"
              placeholder="e.g. Aspiring Python developer from India 🇮🇳"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={120}
            />
            <p className="text-[10px] text-muted-foreground text-right">{bio.length}/120</p>
          </div>

          {/* Interest Skills */}
          <div className="space-y-2">
            <Label>What do you want to learn?</Label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                    skills.includes(skill)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {skills.includes(skill) && <Check className="w-3 h-3 inline mr-1" />}
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button onClick={handleComplete} className="w-full h-11 gap-2">
            Complete Profile
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Skip for now */}
          <button
            onClick={async () => {
              const fallbackName = name.trim() || user?.displayName || user?.email?.split("@")[0] || "Python Learner";
              try {
                await saveProfile({
                  displayName: fallbackName,
                  bio: bio.trim(),
                  avatarUrl: profilePic,
                  skills,
                  profileComplete: true,
                });
                navigate("/dashboard");
              } catch (error) {
                toast({
                  title: "Profile Save Failed",
                  description: error instanceof Error ? error.message : "We couldn't save your profile.",
                  variant: "destructive",
                });
              }
            }}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now →
          </button>
        </div>

        {/* Privacy note */}
        <p className="text-[10px] text-muted-foreground text-center">
          By completing your profile, you agree to our{" "}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
          Your data is stored locally on your device.
        </p>
      </motion.div>

      {/* Support QR Popup — small, non-intrusive, bottom-right */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-xl shadow-xl p-3 w-48"
          >
            <button onClick={() => setShowQR(false)} className="absolute top-1 right-1 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] font-medium text-foreground mb-1.5 text-center">💝 Support PyMaster</p>
            <img src={gpayQR} alt="Support QR" className="w-full rounded-lg" />
            <p className="text-[9px] text-muted-foreground text-center mt-1">Scan to donate via UPI</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
