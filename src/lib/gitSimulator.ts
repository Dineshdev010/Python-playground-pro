/**
 * Linux Sandbox Simulator
 * Simulates a broad set of Bash / Linux commands in the browser.
 * Each command returns realistic output for learning purposes.
 */
export class GitSimulator {
  cwd: string = "/home/learner";
  branch: string = "main";
  history: string[] = [];
  fileSystem: Map<string, string> = new Map([
    ["README.md",   "# My Project\nA learning project on PyMaster."],
    ["app.py",      "#!/usr/bin/env python3\nprint('Hello from app.py')"],
    ["notes.txt",   "Linux notes:\n- pwd shows current directory\n- ls lists files"],
    [".bashrc",     "# .bashrc\nexport PATH=$PATH:/usr/local/bin\nalias ll='ls -la'"],
    [".bash_profile", "# .bash_profile\n[ -f ~/.bashrc ] && . ~/.bashrc"],
  ]);
  services: Record<string, string> = { nginx: "inactive", ssh: "active", mysql: "inactive", cron: "active" };
  packages: Set<string> = new Set(["bash", "git", "python3", "pip3", "curl", "vim", "nano"]);
  envVars: Record<string, string> = {
    HOME: "/home/learner",
    USER: "learner",
    SHELL: "/bin/bash",
    PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
    LANG: "en_US.UTF-8",
    TERM: "xterm-256color",
    HOSTNAME: "pymaster-vm",
  };
  aliases: Record<string, string> = { ll: "ls -la", la: "ls -la", cls: "clear" };
  cmdHistory: string[] = [];

  private prompt() {
    return `learner@pymaster:${this.cwd.replace("/home/learner", "~")}$`;
  }

  private dirName(path: string) {
    return path.split("/").pop() || "/";
  }

  executeCommand(cmdRaw: string): string {
    const trimmed = cmdRaw.trim();
    if (!trimmed || trimmed.startsWith("#")) return "";

    // Resolve aliases
    const firstWord = trimmed.split(/\s+/)[0];
    if (this.aliases[firstWord]) {
      const resolved = this.aliases[firstWord] + " " + trimmed.slice(firstWord.length);
      return this.executeCommand(resolved.trim());
    }

    this.cmdHistory.push(trimmed);
    this.history.push(trimmed);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    const rawArgs = trimmed.slice(cmd.length).trim(); // preserve spacing

    // ===== SPECIAL SIGNALS =====
    if (cmd === "clear" || cmd === "reset") return "CLEAR_TERMINAL";
    if (cmd === "exit" || cmd === "logout") return "Session closed.";

    const lowerCmd = cmd.toLowerCase();

    switch (cmd) {
      // ── Identity & System ──────────────────────────────────────────
      case "whoami":   return "learner";
      case "who":      return "learner  pts/0        2024-04-12 10:00 (192.168.1.1)";
      case "w":        return " 10:32:15 up 2 days,  4:12,  1 user,  load average: 0.05, 0.03, 0.01\nUSER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT\nlearner  pts/0    192.168.1.1      10:00    1.00s  0.12s  0.01s w";
      case "id":       return "uid=1000(learner) gid=1000(learner) groups=1000(learner),27(sudo),100(users)";
      case "hostname": return "pymaster-vm";
      case "uptime":   return " 10:32:15 up 2 days,  4:12,  1 user,  load average: 0.05, 0.03, 0.01";
      case "date":     return new Date().toLocaleString("en-US", { weekday:"short", year:"numeric", month:"short", day:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false }) + " UTC";
      case "cal":      return this._calendar();
      case "uname":
        if (args.includes("-a")) return "Linux pymaster-vm 5.15.0-91-generic #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux";
        if (args.includes("-r")) return "5.15.0-91-generic";
        if (args.includes("-s")) return "Linux";
        if (args.includes("-m")) return "x86_64";
        return "Linux";

      // ── Navigation ────────────────────────────────────────────────
      case "pwd": return this.cwd;
      case "cd": {
        const target = args[0] || "/home/learner";
        if (target === "~" || target === "")   this.cwd = "/home/learner";
        else if (target === "..") this.cwd = this.cwd.split("/").slice(0, -1).join("/") || "/";
        else if (target === "/") this.cwd = "/";
        else if (target === "-") return "/home/learner";
        else if (target.startsWith("/")) this.cwd = target;
        else this.cwd = `${this.cwd}/${target}`.replace(/\/+/g, "/");
        return "";
      }
      case "dirs": return `${this.cwd.replace("/home/learner", "~")}`;

      // ── File listing ───────────────────────────────────────────────
      case "ls": {
        const files = Array.from(this.fileSystem.keys());
        if (args.includes("-la") || args.includes("-al") || (args.includes("-l") && args.includes("-a"))) {
          const lines = ["total " + (files.length * 8)];
          lines.push("drwxr-xr-x 3 learner learner 4096 Apr 12 10:00 .");
          lines.push("drwxr-xr-x 4 root    root    4096 Apr 10 08:00 ..");
          files.forEach(f => {
            const size = (this.fileSystem.get(f) || "").length;
            const perm = f.startsWith(".") ? "-rw-r--r--" : f.endsWith(".py") ? "-rwxr-xr-x" : "-rw-r--r--";
            lines.push(`${perm} 1 learner learner ${String(size).padStart(5)} Apr 12 10:00 ${f}`);
          });
          return lines.join("\n");
        }
        if (args.includes("-l")) {
          return files.filter(f => !f.startsWith(".")).map(f => {
            const size = (this.fileSystem.get(f) || "").length;
            return `-rw-r--r-- 1 learner learner ${String(size).padStart(5)} Apr 12 10:00 ${f}`;
          }).join("\n");
        }
        if (args.includes("-a")) return [".", "..", ...files].join("  ");
        return files.filter(f => !f.startsWith(".")).join("  ");
      }

      // ── File operations ───────────────────────────────────────────
      case "mkdir":
        if (!args.length) return "mkdir: missing operand";
        args.filter(a => !a.startsWith("-")).forEach(d => this.fileSystem.set(d + "/", ""));
        return "";
      case "touch":
        if (!args.length) return "touch: missing file operand";
        args.forEach(f => { if (!this.fileSystem.has(f)) this.fileSystem.set(f, ""); });
        return "";
      case "rm":
        if (!args.length) return "rm: missing operand";
        args.filter(a => !a.startsWith("-")).forEach(f => this.fileSystem.delete(f));
        return "";
      case "rmdir":
        args.forEach(d => this.fileSystem.delete(d + "/"));
        return "";
      case "cp": {
        const [src, dst] = args.filter(a => !a.startsWith("-"));
        if (!src || !dst) return "cp: missing file operand";
        const content = this.fileSystem.get(src) || "";
        this.fileSystem.set(dst, content);
        return "";
      }
      case "mv": {
        const [src, dst] = args.filter(a => !a.startsWith("-"));
        if (!src || !dst) return "mv: missing file operand";
        const content = this.fileSystem.get(src) || "";
        this.fileSystem.set(dst, content);
        this.fileSystem.delete(src);
        return "";
      }
      case "ln":
        return `ln: '${args[args.length - 1] || "link"}' created`;
      case "file": {
        const f = args[0] || "";
        if (!this.fileSystem.has(f)) return `file: ${f}: No such file or directory`;
        if (f.endsWith(".md") || f.endsWith(".txt")) return `${f}: ASCII text`;
        if (f.endsWith(".py")) return `${f}: Python script, ASCII text executable`;
        if (f.endsWith("/")) return `${f}: directory`;
        return `${f}: data`;
      }

      // ── File content ──────────────────────────────────────────────
      case "cat": {
        if (!args.length) return "cat: reading from stdin is not supported here";
        const filename = args.find(a => !a.startsWith("-")) || "";
        if (filename === "/etc/os-release") return 'PRETTY_NAME="Ubuntu 22.04.3 LTS"\nNAME="Ubuntu"\nVERSION_ID="22.04"\nID=ubuntu';
        if (filename === "/etc/passwd") return "root:x:0:0:root:/root:/bin/bash\nlearner:x:1000:1000:Learner:/home/learner:/bin/bash";
        if (filename === "/etc/hostname") return "pymaster-vm";
        if (filename === "/proc/cpuinfo") return "processor\t: 0\nmodel name\t: Intel(R) Core(TM) i7 CPU @ 3.60GHz\ncpu MHz\t\t: 3600.000\ncache size\t: 8192 KB";
        if (filename === "/proc/meminfo") return "MemTotal:        8192000 kB\nMemFree:         4096000 kB\nMemAvailable:    5120000 kB";
        const content = this.fileSystem.get(filename);
        if (content !== undefined) return content || `(empty file)`;
        return `cat: ${filename}: No such file or directory`;
      }
      case "head": {
        const n = args.includes("-n") ? parseInt(args[args.indexOf("-n") + 1]) : 10;
        const file = args.find(a => !a.startsWith("-")) || "";
        const content = this.fileSystem.get(file) || `head: ${file}: No such file or directory`;
        return content.split("\n").slice(0, n).join("\n");
      }
      case "tail": {
        const n = args.includes("-n") ? parseInt(args[args.indexOf("-n") + 1]) : 10;
        const file = args.find(a => !a.startsWith("-")) || "";
        const content = this.fileSystem.get(file) || `tail: ${file}: No such file or directory`;
        return content.split("\n").slice(-n).join("\n");
      }
      case "less":
      case "more":
        return `[Viewing ${args[0] || "file"}... press q to quit (simulated)]`;
      case "nano":
      case "vim":
      case "vi":
      case "emacs":
        return `[${cmd} editor is not available in sandbox mode. Use 'echo text >> file' to write files.]`;

      // ── Text processing ───────────────────────────────────────────
      case "echo": {
        const text = rawArgs.replace(/^["']|["']$/g, "");
        // handle variable substitution
        return text.replace(/\$(\w+)/g, (_, v) => this.envVars[v] || "");
      }
      case "grep": {
        const pattern = args.find(a => !a.startsWith("-")) || "";
        const file = args[args.length - 1];
        const content = this.fileSystem.get(file) || "";
        if (!content) return `grep: ${file}: No such file or directory`;
        const lines = content.split("\n").filter(l => l.includes(pattern));
        return lines.length ? lines.join("\n") : "(no matches found)";
      }
      case "sed":
        return `[sed] pattern substitution applied to ${args[args.length - 1]} (simulated)`;
      case "awk":
        return `[awk] processing ${args[args.length - 1]}:\nfield1  field2  field3\nvalue1  value2  value3`;
      case "cut":
        return `[cut] extracted columns from input (simulated)`;
      case "wc": {
        const file = args.find(a => !a.startsWith("-")) || "";
        const content = this.fileSystem.get(file) || "";
        const lines = content.split("\n").length;
        const words = content.split(/\s+/).filter(Boolean).length;
        const bytes = content.length;
        return `${lines}\t${words}\t${bytes}\t${file}`;
      }
      case "sort":
        return `[sort] lines sorted (simulated output from ${args[args.length - 1] || "stdin"})`;
      case "uniq":
        return `[uniq] duplicate lines removed (simulated)`;
      case "tr":
        return `[tr] character translation applied (simulated)`;
      case "bc":
        return "2.0.0 (simulated calculator)";
      case "base64":
        return btoa(args[args.length - 1] || "simulated data");
      case "md5sum":
        return `d41d8cd98f00b204e9800998ecf8427e  ${args[0] || "-"}`;
      case "sha1sum":
        return `da39a3ee5e6b4b0d3255bfef95601890afd80709  ${args[0] || "-"}`;
      case "sha256sum":
        return `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  ${args[0] || "-"}`;
      case "sum":
      case "cksum":
        return `34251 1 ${args[0] || "-"}`;
      case "diff":
        return `--- ${args[0]}\n+++ ${args[1]}\n@@ -1,3 +1,3 @@\n context line\n-old line\n+new line`;

      // ── Redirection & pipes ───────────────────────────────────────
      case "tee":
        return `(tee: writing stdin to ${args[args.length - 1] || "file"} simulated)`;
      case "xargs":
        return `(xargs: piped input processed)`;

      // ── Search ────────────────────────────────────────────────────
      case "find": {
        const name = args.includes("-name") ? args[args.indexOf("-name") + 1] : "*";
        const found = Array.from(this.fileSystem.keys()).filter(f => name === "*" || f.includes(name.replace(/\*/g, "")));
        return found.map(f => `${this.cwd}/${f}`).join("\n") || "(no files found)";
      }
      case "locate":
        return `/home/learner/${args[0]}\n/usr/bin/${args[0]}`;
      case "which":
        if (!args.length) return "which: missing argument";
        return `/usr/bin/${args[0]}`;
      case "whereis":
        return `${args[0]}: /usr/bin/${args[0]} /usr/share/man/man1/${args[0]}.1.gz`;
      case "type":
        return `${args[0]} is /usr/bin/${args[0]}`;

      // ── File permissions ──────────────────────────────────────────
      case "chmod":
        return args.length >= 2 ? "" : "chmod: missing operand";
      case "chown":
        return "";
      case "chgrp":
        return "";
      case "umask":
        return "0022";
      case "stat": {
        const file = args.find(a => !a.startsWith("-")) || "";
        return `  File: ${file}\n  Size: ${(this.fileSystem.get(file) || "").length}\t\tBlocks: 8          IO Block: 4096 regular file\nDevice: 801h/2049d\tInode: 131073      Links: 1\nAccess: -rw-r--r-- Uid: 1000/learner  Gid: 1000/learner\nAccess: 2024-04-12 10:00:00\nModify: 2024-04-12 10:00:00`;
      }

      // ── Disk & memory ─────────────────────────────────────────────
      case "df":
        return "Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   12G   36G  25% /\ntmpfs           3.9G     0  3.9G   0% /dev/shm";
      case "du": {
        const target = args.find(a => !a.startsWith("-")) || ".";
        return `4\t${this.cwd}/${target}`;
      }
      case "free":
        return "               total        used        free      shared  buff/cache   available\nMem:           7.8Gi       1.2Gi       5.1Gi       125Mi       1.5Gi       6.2Gi\nSwap:          2.0Gi          0B       2.0Gi";
      case "lsblk":
        return "NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT\nsda      8:0    0   50G  0 disk\n└─sda1   8:1    0   50G  0 part /";

      // ── Processes ─────────────────────────────────────────────────
      case "ps":
        if (args.includes("aux") || (args.includes("a") && args.includes("u") && args.includes("x"))) {
          return "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1 168472 11904 ?        Ss   10:00   0:01 /sbin/init\nroot       420  0.0  0.1  21452  1104 ?        S    10:00   0:00 /sbin/udevd\nlearner    501  0.5  0.2 823414 42104 pts/0    Ss   10:05   0:00 bash\nlearner    502  0.0  0.1  21452  3104 pts/0    R+   10:10   0:00 ps aux";
        }
        return "  PID TTY          TIME CMD\n  501 pts/0    00:00:00 bash\n  502 pts/0    00:00:00 ps";
      case "top":
      case "htop":
        return "Tasks: 52 total,   1 running,  51 sleeping\n%Cpu(s):  0.5 us,  0.2 sy,  0.0 ni, 99.3 id,  0.0 wa\nMiB Mem :  7987.3 total,  4200.1 free,  1987.3 used,  1799.9 buff/cache\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n  501 learner   20   0   21452   3104   2944 S   0.3   0.0   0:00.12 bash";
      case "kill":
        return args.length ? `kill: sent signal to process ${args[args.length - 1]}` : "kill: missing argument";
      case "killall":
        return `Killed all ${args[0] || "process"} processes`;
      case "jobs":
        return "[1]+  Running    sleep 100 &";
      case "bg":
        return "[1]+ sleep 100 &";
      case "fg":
        return "sleep 100";
      case "nohup":
        return `nohup: appending output to 'nohup.out'`;
      case "sleep":
        return `(slept ${args[0] || 1} second(s))`;

      // ── Networking ────────────────────────────────────────────────
      case "ip":
        if (args[0] === "addr" || args[0] === "a") return "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500\n    inet 192.168.1.42/24 brd 192.168.1.255 scope global dynamic eth0";
        if (args[0] === "route" || args[0] === "r") return "default via 192.168.1.1 dev eth0\n192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.42";
        return "Usage: ip [ OPTIONS ] OBJECT { COMMAND | help }";
      case "ifconfig":
        return "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n      inet 192.168.1.42  netmask 255.255.255.0  broadcast 192.168.1.255\nlo:   flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n      inet 127.0.0.1  netmask 255.0.0.0";
      case "ping":
        return `PING ${args[0] || "google.com"} (142.250.190.46) 56(84) bytes of data.\n64 bytes from ${args[0] || "google.com"}: icmp_seq=1 ttl=118 time=12.4 ms\n64 bytes from ${args[0] || "google.com"}: icmp_seq=2 ttl=118 time=11.9 ms\n--- ${args[0] || "google.com"} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`;
      case "curl":
      case "wget": {
        const url = args.find(a => !a.startsWith("-")) || "";
        if (!url) return `${cmd}: missing URL`;
        return `${cmd}: Simulated — ${url}\n{"status":"ok","message":"Simulated response from ${url}"}`;
      }
      case "netstat":
        return "Proto  Recv-Q  Send-Q  Local Address     Foreign Address   State\ntcp        0       0   0.0.0.0:22        0.0.0.0:*         LISTEN\ntcp        0       0   127.0.0.1:631     0.0.0.0:*         LISTEN";
      case "ss":
        return "Netid  State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port\ntcp    LISTEN  0       128     *:22               *:*";
      case "nmap":
        return `Starting Nmap 7.93 ( https://nmap.org )\nNmap scan report for ${args[args.length-1] || "localhost"}\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https`;
      case "traceroute":
        return `traceroute to ${args[0] || "google.com"}, 30 hops max\n 1  192.168.1.1  1.234 ms\n 2  10.0.0.1     5.678 ms\n 3  google.com   12.345 ms`;
      case "dig":
        return `; <<>> DiG 9.18.0 <<>> ${args[0] || "example.com"}\n;; ANSWER SECTION:\n${args[0] || "example.com"}. 300 IN A 93.184.216.34`;
      case "nslookup":
        return `Server:   8.8.8.8\nAddress:  8.8.8.8#53\n\nName:     ${args[0] || "example.com"}\nAddress:  93.184.216.34`;

      // ── SSH & Crypto ──────────────────────────────────────────────
      case "ssh":
        return `ssh: Simulated — connecting to ${args[args.length-1]}... (Connection not available in sandbox)`;
      case "scp":
        return "scp: Simulated file transfer complete";
      case "ssh-keygen":
        return "Generating public/private rsa key pair.\nEnter file in which to save the key (/home/learner/.ssh/id_rsa):\nYour identification has been saved in /home/learner/.ssh/id_rsa\nYour public key has been saved in /home/learner/.ssh/id_rsa.pub\nThe key fingerprint is:\nSHA256:abc123xyz learner@pymaster-vm";
      case "openssl":
        if (args[0] === "genrsa") return "Generating RSA private key, 2048 bit... done";
        if (args[0] === "version") return "OpenSSL 3.0.2 15 Mar 2022 (Library: OpenSSL 3.0.2 15 Mar 2022)";
        return "OpenSSL command simulated";

      // ── Package management ────────────────────────────────────────
      case "apt":
      case "apt-get": {
        const aptCmd = args[0];
        const pkg = args.find((a, i) => i > 0 && !a.startsWith("-")) || "";
        if (aptCmd === "update") return "Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease\nGet:2 http://security.ubuntu.com/ubuntu jammy-security InRelease\nReading package lists... Done";
        if (aptCmd === "upgrade") return "Reading package lists... Done\nBuilding dependency tree... Done\n0 upgraded, 0 newly installed, 0 to remove";
        if (aptCmd === "install") {
          if (!pkg) return `${cmd}: No packages specified`;
          this.packages.add(pkg);
          return `Reading package lists... Done\nBuilding dependency tree... Done\nThe following NEW packages will be installed:\n  ${pkg}\nSetting up ${pkg}... Done`;
        }
        if (aptCmd === "remove") { this.packages.delete(pkg); return `Removing ${pkg}... Done`; }
        if (aptCmd === "search") return `${pkg}/jammy 1.0.0-1 amd64\n  ${pkg} - Package for learning`;
        if (aptCmd === "list") return Array.from(this.packages).map(p => `${p}/jammy,now 1.0.0 amd64 [installed]`).join("\n");
        return `apt: '${aptCmd}' is not an apt command`;
      }
      case "pip":
      case "pip3": {
        const pipCmd = args[0];
        const pkg = args.find((a, i) => i > 0 && !a.startsWith("-")) || "";
        if (pipCmd === "install") {
          if (!pkg) return "pip: No packages specified";
          this.packages.add(pkg);
          return `Collecting ${pkg}\nDownloading ${pkg}-1.0.0-py3-none-any.whl (25 kB)\nInstalling collected packages: ${pkg}\nSuccessfully installed ${pkg}-1.0.0`;
        }
        if (pipCmd === "list") return "Package     Version\n----------- -------\nnumpy       1.26.0\npandas      2.1.2\nrequests    2.31.0\nflask       3.0.0\n" + Array.from(this.packages).map(p => `${p.padEnd(12)}1.0.0`).join("\n");
        if (pipCmd === "show") return `Name: ${pkg}\nVersion: 1.0.0\nSummary: Simulated package\nHome-page: https://pypi.org/project/${pkg}`;
        if (pipCmd === "uninstall") { this.packages.delete(pkg); return `Found existing installation: ${pkg} 1.0.0\nSuccessfully uninstalled ${pkg}-1.0.0`; }
        if (pipCmd === "freeze") return "numpy==1.26.0\npandas==2.1.2\nrequests==2.31.0";
        return "pip " + args.join(" ");
      }
      case "python3":
      case "python": {
        if (!args.length || args[0] === "--version" || args[0] === "-V") return `Python 3.11.5`;
        if (args[0] === "-c") {
          const code = rawArgs.replace(/^-c\s+["']?|["']?$/g, "");
          return `[Running: python3 -c "${code}"]\n(Use the Python mode in the compiler to execute code)`;
        }
        const file = args[0];
        const content = this.fileSystem.get(file);
        if (content) return `[Running: python3 ${file}]\n(Use the Python mode in the compiler to execute code)`;
        return `python3: can't open file '${file}': [Errno 2] No such file or directory`;
      }
      case "node":
      case "nodejs":
        if (args[0] === "--version" || args[0] === "-v") return "v20.10.0";
        return "[Node.js] Use the online compiler for JavaScript execution";

      // ── Archive & compression ─────────────────────────────────────
      case "tar": {
        const isCreate  = args.includes("-c") || args.includes("c");
        const isExtract = args.includes("-x") || args.includes("x");
        const isVerbose = args.includes("-v") || args.includes("v");
        const file = args.find((a, i) => i > 0 && !a.startsWith("-")) || "archive.tar.gz";
        if (isCreate)  return `${isVerbose ? Array.from(this.fileSystem.keys()).join("\n") + "\n" : ""}Created archive: ${file}`;
        if (isExtract) return `${isVerbose ? "README.md\napp.py\nnotes.txt\n" : ""}Extracted: ${file}`;
        return "tar: usage: tar [OPTIONS] [FILE...]";
      }
      case "gzip":
        return `gzip: compressed ${args[0] || "file"} → ${args[0] || "file"}.gz`;
      case "gunzip":
        return `gunzip: decompressed ${args[0] || "file.gz"}`;
      case "zip":
        return `  adding: ${args.slice(1).join(" ")} (deflated 60%)\nCreated: ${args[0]}`;
      case "unzip":
        return `Archive: ${args[0]}\n  inflating: file1.txt\n  inflating: file2.txt`;

      // ── Environment ────────────────────────────────────────────────
      case "env":
      case "printenv":
        if (args.length) return this.envVars[args[0]] || "";
        return Object.entries(this.envVars).map(([k, v]) => `${k}=${v}`).join("\n");
      case "export":
        if (args[0]?.includes("=")) {
          const [k, ...rest] = args[0].split("=");
          this.envVars[k] = rest.join("=").replace(/^["']|["']$/g, "");
        }
        return "";
      case "unset":
        if (args[0]) delete this.envVars[args[0]];
        return "";
      case "set":
        return Object.entries(this.envVars).map(([k,v]) => `${k}="${v}"`).join("\n");
      case "source":
      case ".":
        return `Sourced: ${args[0] || ".bashrc"}`;
      case "alias":
        if (!args.length) return Object.entries(this.aliases).map(([k,v]) => `alias ${k}='${v}'`).join("\n");
        if (args[0].includes("=")) {
          const [k, v] = args[0].split("=");
          this.aliases[k] = v.replace(/^["']|["']$/g, "");
        }
        return "";
      case "unalias":
        if (args[0]) delete this.aliases[args[0]];
        return "";

      // ── Shell history ──────────────────────────────────────────────
      case "history":
        return this.cmdHistory.map((c, i) => `  ${String(i+1).padStart(4)}  ${c}`).join("\n");

      // ── Identity & Permissions ─────────────────────────────────────
      case "sudo":
        if (!args.length) return "sudo: usage: sudo COMMAND";
        return this.executeCommand(args.join(" "));
      case "su":
        return "(Switching users is not available in sandbox mode)";
      case "passwd":
        return "Changing password for learner.\npasswd: password updated successfully";
      case "useradd":
        return `useradd: user '${args[args.length-1]}' added`;
      case "userdel":
        return `userdel: user '${args[args.length-1]}' deleted`;

      // ── Services ───────────────────────────────────────────────────
      case "systemctl": {
        const action = args[0], svc = args[1] || "";
        if (action === "status") return `● ${svc}.service - ${svc} service\n   Loaded: loaded\n   Active: ${this.services[svc] === "active" ? "active (running)" : "inactive (dead)"}`;
        if (action === "start")  { this.services[svc] = "active"; return ""; }
        if (action === "stop")   { this.services[svc] = "inactive"; return ""; }
        if (action === "restart") { this.services[svc] = "active"; return `Restarted ${svc}.service`; }
        if (action === "enable") return `Created symlink /etc/systemd/system/multi-user.target.wants/${svc}.service`;
        if (action === "disable") return `Removed /etc/systemd/system/multi-user.target.wants/${svc}.service`;
        if (action === "list-units") return "UNIT                  LOAD   ACTIVE SUB     DESCRIPTION\ncron.service          loaded active running Scheduled tasks\nssh.service           loaded active running OpenSSH Daemon";
        return `systemctl: unknown command: ${action}`;
      }
      case "service": {
        const svc = args[0], action = args[1];
        if (action === "start")  { this.services[svc] = "active"; return `Starting ${svc}... [ OK ]`; }
        if (action === "stop")   { this.services[svc] = "inactive"; return `Stopping ${svc}... [ OK ]`; }
        if (action === "status") return `${svc} is ${this.services[svc] === "active" ? "running" : "stopped"}`;
        return "";
      }
      case "crontab":
        if (args.includes("-l")) return "# PyMaster Crontab\n*/5 * * * * /home/learner/app.py >> /tmp/run.log 2>&1";
        if (args.includes("-e")) return "(Opening crontab editor is simulated — use nano in real terminal)";
        return "";

      // ── Hardware ───────────────────────────────────────────────────
      case "lscpu":
        return "Architecture:        x86_64\nCPU(s):              4\nModel name:          Intel(R) Core(TM) i7 @ 3.60GHz\nCPU MHz:             3600.000\nL3 cache:            8192K";
      case "lsusb":
        return "Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub";
      case "lspci":
        return "00:00.0 Host bridge: Intel Corporation 440FX - 82441FX PMC\n00:01.0 VGA compatible controller: NVIDIA GeForce RTX";
      case "dmesg":
        return "[    0.000000] Linux version 5.15.0-91-generic\n[    0.001234] ACPI: Core revision 20210730\n[    1.234567] eth0: Link is Up";

      // ── Firewall & Security ────────────────────────────────────────
      case "ufw":
        if (args[0] === "status") return "Status: active\nTo                         Action      From\n--                         ------      ----\n22/tcp                     ALLOW       Anywhere\n80/tcp                     ALLOW       Anywhere";
        if (args[0] === "allow") return `Rule added: ${args[1] || "port"} allowed`;
        if (args[0] === "deny")  return `Rule added: ${args[1] || "port"} denied`;
        if (args[0] === "enable") return "Firewall is active and enabled on system startup";
        return "";
      case "iptables":
        return "-A INPUT -i lo -j ACCEPT\n-A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n-A INPUT -p tcp --dport 22 -j ACCEPT";

      // ── Misc utils ─────────────────────────────────────────────────
      case "man":
        return `MAN PAGE: ${args[0] || "man"}\n\nNAME\n    ${args[0] || "command"} - manual page\n\nSYNOPSIS\n    ${args[0] || "command"} [OPTIONS] [ARGUMENTS]\n\nDESCRIPTION\n    Manual page for ${args[0] || "command"} (simulated in sandbox)`;
      case "help":
        return ` PyMaster Terminal — List of Supported Commands
 ─────────────────────────────────────────────────────────────
 📂 FILE OPS:   ls, cd, pwd, mkdir, touch, rm, cp, mv, cat, head, tail, find, locate, which, stat, file
 ⚙️ SYSTEM:     whoami, id, uptime, date, cal, uname, lscpu, lsusb, hostname, df, du, free, top, service
 🧪 PROCESSING: echo, grep, sed, awk, cut, wc, sort, uniq, tr, bc, base64, md5sum, sha256sum, diff
 🌐 NETWORK:    ip, ifconfig, ping, curl, wget, netstat, ss, nmap, nslookup, dig, ssh, scp
 📦 PACKAGES:   apt, pip, git, python3, node
 🛡️ SECURITY:   sudo, chmod, chown, systemctl, ufw, iptables, passwd
 🐚 BASH:       alias, export, env, history, clear, exit, help, man, tldr, time, watch, sleep

 Type 'man [command]' for detailed help or 'tldr [command]' for quick examples.
 ─────────────────────────────────────────────────────────────`;
      case "info":
        return `Info page for ${args[0] || "command"} (simulated)`;
      case "tldr":
        return `tldr: ${args[0] || "command"}\n  Quick reference for ${args[0] || "command"}.\n  - Basic usage: ${args[0] || "command"} [options] [arguments]`;
      case "xdg-open":
      case "open":
        return `Opening ${args[0] || "file"} (simulated)`;
      case "tput":
        return "";
      case "read":
        return "(interactive read not available in sandbox)";
      case "true":   return "";
      case "false":  return ""; // returns exit code 1 in real bash, but we can't propagate that
      case "test":   return "";
      case "[":      return "";
      case "time":   return this.executeCommand(args.join(" ")) + "\nreal\t0m0.001s\nuser\t0m0.000s\nsys\t0m0.000s";
      case "watch":  return `[watch] Running '${args.join(" ")}' every 2s (simulated)`;
      case "script": return "Script started, file is typescript";
      case "strace": return `execve("${args[0]}", ...) = 0 (simulated)`;
      case "ltrace": return `(ltrace output for ${args[0]} simulated)`;

      case "git": {
        const gitCmd = args[0];
        const gitArgs = args.slice(1);
        if (gitCmd === "init") return `Initialized empty Git repository in ${this.cwd}/.git/`;
        if (gitCmd === "clone") return `Cloning into '${(gitArgs[0] || "repo").split("/").pop()}'...\nremote: Enumerating objects: 42, done.\nReceiving objects: 100% (42/42), 15.3 KiB | 8.4 MiB/s, done.`;
        if (gitCmd === "status") return `On branch ${this.branch}\nYour branch is up to date with 'origin/${this.branch}'.\n\nnothing to commit, working tree clean`;
        if (gitCmd === "add") return "";
        if (gitCmd === "commit") {
          const msg = (trimmed.match(/-m\s+["'](.+?)["']/) || [])[1] || "Update files";
          return `[${this.branch} a1b2c3d] ${msg}\n 1 file changed, 5 insertions(+), 2 deletions(-)`;
        }
        if (gitCmd === "push")    return `Enumerating objects: 5, done.\nTo github.com:user/repo.git\n   a1b2c3d..e4f5g6h  ${this.branch} -> ${this.branch}`;
        if (gitCmd === "pull")    return `Already up to date.\nCurrent branch ${this.branch} is up to date.`;
        if (gitCmd === "fetch")   return `From https://github.com/user/repo\n * branch            ${this.branch}     -> FETCH_HEAD`;
        if (gitCmd === "log")     return `commit e4f5g6h7i8j9k0l1 (HEAD -> ${this.branch}, origin/${this.branch})\nAuthor: Learner <learner@pymaster.com>\nDate:   ${new Date().toDateString()}\n\n    Latest commit message`;
        if (gitCmd === "branch")  return `* ${this.branch}\n  main\n  dev\n  feature/login`;
        if (gitCmd === "checkout") {
          const b = gitArgs[gitArgs.length - 1];
          if (gitArgs.includes("-b")) { this.branch = b; return `Switched to a new branch '${b}'`; }
          this.branch = b; return `Switched to branch '${b}'`;
        }
        if (gitCmd === "merge")   return `Updating a1b2c3d..e4f5g6h\nFast-forward\n README.md | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)`;
        if (gitCmd === "rebase")  return `Successfully rebased and updated refs/heads/${this.branch}`;
        if (gitCmd === "diff")    return `--- a/app.py\n+++ b/app.py\n@@ -1,3 +1,4 @@\n print('hello')\n+print('world')`;
        if (gitCmd === "stash")   return `Saved working directory index state WIP on ${this.branch}: a1b2c3d Latest commit`;
        if (gitCmd === "tag")     return "v1.0.0\nv1.1.0\nv2.0.0";
        if (gitCmd === "remote")  return "origin\tupstream";
        if (gitCmd === "config")  return "";
        if (gitCmd === "--version") return "git version 2.43.0";
        if (gitCmd === "help" || !gitCmd) return "usage: git [--version] [--help] <command> [<args>]\n\nCommon commands: add, branch, checkout, clone, commit, diff, fetch, init, log, merge, pull, push, remote, rebase, stash, status, tag";
        return `git: '${gitCmd}' is not a git command. See 'git help'.`;
      }

      default:
        // Try to be helpful with case sensitivity
        if (trimmed.toUpperCase() === trimmed && cmd !== lowerCmd) {
          const checkAgain = this.executeCommand(lowerCmd + " " + args.join(" "));
          if (!checkAgain.includes("command not found")) {
            return `bash: ${cmd}: command not found (Did you mean '${lowerCmd}'?)\nType 'help' for a list of built-in commands.`;
          }
        }
        return `bash: ${cmd}: command not found\nType 'help' for a list of built-in commands, or 'man ${cmd}' for documentation.`;
    }
  }

  private _calendar(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let cal = `   ${monthNames[month]} ${year}\nSu Mo Tu We Th Fr Sa\n`;
    let row = "   ".repeat(firstDay);
    for (let d = 1; d <= daysInMonth; d++) {
      row += String(d).padStart(2) + " ";
      if ((firstDay + d) % 7 === 0) { cal += row.trimEnd() + "\n"; row = ""; }
    }
    if (row.trim()) cal += row.trimEnd() + "\n";
    return cal;
  }
}
