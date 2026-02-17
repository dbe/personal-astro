---
title: "Installing NixOS: Dual Booting from Windows 10"
date: 2018-06-13
description: "A beginner-friendly tutorial for installing NixOS alongside Windows 10 with UEFI."
tags: ["linux", "nixos", "tutorial"]
---

![NixOS](/images/writing/installing-nixos/nixos-logo.png)

This is a tutorial for people who currently run Windows 10 and want to install NixOS on the same system. I found the existing documentation a bit sparse for beginners, so I wrote something more step-by-step.

This guide is applicable if you:

- Currently run Windows 10
- Have a computer that uses UEFI
- Have a USB thumb drive available
- Have sufficient free disk space (I used 128 gigs)
- Don't need an encrypted partition

These aren't prerequisites for NixOS in general -- just for this specific tutorial. If your setup is different, these resources may be more helpful:

- [NixOS Manual](https://nixos.org/nixos/manual/)
- [Gist by martijnvermaat](https://gist.github.com/martijnvermaat/76f2e24d0239470dd71050b5570f4e5f)
- [Blog post by adelbertc](https://adelbertc.github.io/posts/2017-04-03-installing-nixos.html)

#### Freeing space for your Nix partition

Open Windows Disk Management (right-click the Start button and select "Disk Management"). Find your main drive, right-click the partition, and select "Shrink Volume." Shrink it by however much space you want to give NixOS. I used 128 gigs.

#### Creating the NixOS bootable USB drive

Follow the NixOS guide for creating a bootable USB from Windows:

[https://nixos.wiki/wiki/NixOS_Installation_Guide#From_Windows](https://nixos.wiki/wiki/NixOS_Installation_Guide#From_Windows)

#### Booting the NixOS installer

Plug in your USB drive and restart your computer. You should see the NixOS installer in your boot menu. Select it and let the countdown expire. You'll drop into a terminal. Start the graphical installer with:

```bash
systemctl start display-manager
```

#### Partitioning the drive

Open GParted from the application menu. Find the drive that has your unallocated space.

**Create the boot partition:**

1. Right-click the unallocated space and select "New"
2. Set new size to 500 (MB)
3. Set name and label to "boot"
4. Set file system to fat32
5. Click "Add"
6. Right-click the new partition, select "Manage Flags", and check "boot" (this will auto-select "esp")

**Create the main partition:**

1. Right-click the remaining unallocated space and select "New"
2. Leave the size at the default (it will take all remaining space)
3. Set name and label to "nixos"
4. Set file system to ext4
5. Click "Add"

**Apply the changes:** Go to Edit and click "Apply All Operations."

**WARNING:** This writes changes to your hard drive. There is potential for data loss if something goes wrong. Double-check everything before applying.

#### Mounting the drives

Open Konsole and mount your new partitions:

```bash
mount /dev/disk/by-label/nixos /mnt
mkdir /mnt/boot
mount /dev/disk/by-label/BOOT /mnt/boot
```

#### Generate the Nix config

```bash
nixos-generate-config --root /mnt
```

This creates a configuration file at `/mnt/etc/nixos/configuration.nix`. You can edit it later to customize your system, but the defaults are fine for a first install.

#### Install Nix

```bash
nixos-install
```

You'll see a stream of text as it downloads and installs packages. This takes a while. When it finishes, it will ask you to set a root password. Do that, and you should see "installation finished!" Type `reboot`.

#### Boot into your new NixOS operating system

After rebooting, select "Linux Boot Manager" from your boot menu. (On most systems, F2 gets you to the permanent boot order settings, and F11 gives you a one-time boot menu.) Select "NixOS" from the list. Log in as root with the password you set during installation.

#### Now the hard part

I hope this helps get more people into Nix. It has some strong ideas about system configuration that are worth being exposed to, even if you don't end up using it as your daily driver. Next up: configuring the OS and installing dependencies.
