# Hướng Dẫn Thiết Lập Nginx Zero-Trust & SSH Tunnel (HTTP 444 Defense)

Tài liệu này hướng dẫn cách cô lập hoàn toàn các route nhạy cảm của trang quản trị (`/admin`, `/api/admin`) khỏi Public Internet, chỉ cho phép truy cập thông qua SSH Tunnel được xác thực bằng SSH Keypair của máy quản trị viên (Windows 11).

---

## 1. Kiến Trúc Tổng Quan (Zero-Trust Security Architecture)

```
[ Public Internet ] ──(HTTPS 443)──► [ Nginx Public Block ]
                                            │
                                            ├──► Public Routes (/, /blog, /about, ...) ──► Nuxt App (127.0.0.1:3000)
                                            └──► /admin, /api/admin ──────────────────► [ HTTP 444: NGẮT KẾT NỐI NGAY ]

[ Windows 11 Admin ]
   (SSH Keypair)
        │
        └──(SSH Tunnel: Port 9000)──► [ Nginx Internal Block: 127.0.0.1:8080 ]
                                            │
                                            └──► Inject Header (X-Internal-Admin) ──► Nuxt App (127.0.0.1:3000)
```

---

## 2. Cấu Hình Nginx Trên Server (VPS)

File cấu hình: `/etc/nginx/sites-available/lequan81.dev`

```nginx
# ==============================================================================
# 1. PUBLIC SERVER BLOCK (Nhận traffic công khai từ Internet)
# ==============================================================================
server {
    listen 80;
    listen [::]:80;
    server_name lequan81.dev www.lequan81.dev;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name lequan81.dev www.lequan81.dev;

    # SSL Certificate (Let's Encrypt / Cloudflare Origin)
    ssl_certificate /etc/letsencrypt/live/lequan81.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lequan81.dev/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Bảo vệ file database SQLite không bao giờ bị truy cập công khai
    location ~* \.(sqlite|sqlite-wal|sqlite-shm|db)$ {
        deny all;
        return 404;
    }

    # BẢO VỆ TUYỆT ĐỐI: Chặn toàn bộ truy cập Admin từ Public Internet
    location ^~ /admin {
        return 444; # Nginx đóng kết nối TCP ngay lập tức, không gửi byte response nào
    }

    location ^~ /api/admin {
        return 444; # Chặn đứng toàn bộ API quản trị
    }

    # Các Route Public (Trang chủ, blog, bài viết, form liên hệ công khai)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # Xóa sạch header nội bộ giả mạo từ Public Internet
        proxy_set_header X-Internal-Admin "";
        proxy_set_header X-Admin-Signature "";

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_cache_bypass $http_upgrade;
    }
}

# ==============================================================================
# 2. INTERNAL SERVER BLOCK (Chỉ lắng nghe nội bộ 127.0.0.1 - Qua SSH Tunnel)
# ==============================================================================
server {
    listen 127.0.0.1:8080; # CHỈ BIND LOCALHOST TRÊN VPS, KHÔNG MỞ FIREWALL RA NGOÀI
    server_name localhost lequan81dev.vinaddns.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # Gán cứng Header xác thực nội bộ để Nuxt Server Middleware kiểm tra
        proxy_set_header X-Internal-Admin "lequan81_vps_internal_trusted_tunnel";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP 127.0.0.1;
        proxy_set_header X-Forwarded-For 127.0.0.1;
        proxy_set_header X-Forwarded-Proto http;
    }
}
```

---

## 3. Cấu Hình Bảo Mật SSH Server Trên VPS

Chỉnh sửa file `/etc/ssh/sshd_config`:

```text
# Vô hiệu hóa đăng nhập bằng mật khẩu
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin prohibit-password

# Cho phép Forwarding qua SSH Tunnel
AllowTcpForwarding yes
X11Forwarding no
```

Sau khi sửa, khởi động lại SSH service:
```bash
sudo systemctl restart sshd
```

---

## 4. Thiết Lập Kết Nối Từ Máy Windows 11 Quản Trị

### Bước 1: Thêm SSH Config trên Windows 11
Mở hoặc tạo file `C:\Users\DELL\.ssh\config`:

```ssh-config
Host vps-blog-tunnel
    HostName IP_HOAC_DOMAIN_VPS_CUA_BAN
    User deployer
    Port 22
    IdentityFile C:\Users\DELL\.ssh\id_ed25519
    LocalForward 9000 127.0.0.1:8080
```

### Bước 2: Thiết lập domain ảo local (Tùy chọn nếu muốn dùng domain thay vì localhost)
Mở Notepad bằng quyền **Run as Administrator** và chỉnh sửa `C:\Windows\System32\drivers\etc\hosts`:
```text
127.0.0.1  lequan81dev.vinaddns.com
```

### Bước 3: Kích hoạt SSH Tunnel
Mở PowerShell trên Windows 11 và chạy:
```powershell
ssh -N vps-blog-tunnel
```
*(Cờ `-N` chỉ mở port forwarding mà không cần mở phiên terminal shell)*.

### Bước 4: Đăng nhập quản trị an toàn
Mở trình duyệt trên máy Windows 11 và truy cập:
- **`http://localhost:9000/admin`** (hoặc `http://lequan81dev.vinaddns.com:9000/admin`)
- Toàn bộ lưu lượng được mã hóa bằng SSH Keypair Ed25519 từ máy tính của bạn thẳng tới VPS.
- Người lạ truy cập `https://lequan81.dev/admin` từ internet sẽ bị Nginx ngắt kết nối với mã **HTTP 444**.

---

## 5. Cấu Hình Thống Nhất File Log Domain & Fail2ban Tự Động

### 5.1. Cấu Trúc Log Chuẩn Theo Domain Trên VPS
Cấu trúc chuẩn tại `/var/log/nginx/<domain>/`:
```text
/var/log/nginx/
├── lequan81dev.vinaddns.com/
│   ├── access.log        # Nginx Access Log
│   ├── error.log         # Nginx Error Log
│   └── security.log      # Nuxt Security Abuse Log (Ghi nhận botnet & honeypot)
├── lequan81.is-a.dev/
└── buddywallet.dpdns.org/
```

### 5.2. Cấu Hình Nginx Ghi Log Vào Đúng Thư Mục Domain
Trong file cấu hình Nginx Server Block:
```nginx
access_log /var/log/nginx/lequan81dev.vinaddns.com/access.log;
error_log  /var/log/nginx/lequan81dev.vinaddns.com/error.log warn;
```

### 5.3. Cấu Hình Fail2ban Giám Sát Động Toàn Bộ Domain
Tạo Filter `/etc/fail2ban/filter.d/nuxt-security.conf`:
```ini
[Definition]
failregex = ^.*\[SECURITY_BOT_ABUSE\] IP: <HOST> .*$
ignoreregex =
```

Kích hoạt Jail trong `/etc/fail2ban/jail.local`:
```ini
[nuxt-security-botnet]
enabled = true
port = http,https
filter = nuxt-security
# Sử dụng ký tự đại diện wildcard (*) để tự động bảo vệ tất cả các website/domain trên VPS
logpath = /var/log/nginx/*/security.log
maxretry = 2
findtime = 600
bantime = 86400
action = iptables-multiport[name=NuxtBotTrap, port="http,https"]
```

### 5.4. Logrotate Tự Động
Hệ thống `logrotate` mặc định của Linux tại `/etc/logrotate.d/nginx` sẽ tự động xoay vòng, nén `.gz` và dọn dẹp các file `*.log` trong `/var/log/nginx/*/*.log` theo định kỳ mà bạn không cần cấu hình thêm cronjob riêng.

