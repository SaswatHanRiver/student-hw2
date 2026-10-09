# Deploy on EC2 with Docker + nginx

One server runs both apps in Docker. nginx (on the host) is the only thing open to the internet:

```
browser -> Cloudflare (HTTPS) -> nginx :80 -> students-hw.dvconsulting.org      -> web (Next.js)    127.0.0.1:3101
                                          -> students-hw-api.dvconsulting.org  -> api (Spring Boot) 127.0.0.1:8101 (H2 in memory)
```
Hostnames are set in `.env` (FRONTEND_URL, API_URL) and in `deploy/nginx/student-hw2.conf` (server_name).

## Cloudflare DNS
Add two **A** records pointing to the EC2 public IP, both **Proxied** (orange cloud):
`students-hw` -> EC2 IP, `students-hw-api` -> EC2 IP. SSL/TLS mode: **Flexible** (Cloudflare to EC2 on port 80).

## Memory (the lowest settings that still run comfortably)
| Container | Limit | What uses it |
|---|---|---|
| web (Next.js standalone) | 160 MB | Node with a 48 MB heap. **Measured: about 125 MB peak** under load |
| api (Spring Boot + H2) | 384 MB | Heap max 128 MB + class metadata + JIT + threads. **Not measured yet**: check with `docker stats` (step 6) |
| **Total at runtime** | **about 0.5 GB** | Fits a t2.micro / t3.micro (1 GB) with nginx |

**Building** needs more memory than running (Maven + Next.js build). On a 1 GB instance, add swap first (step 1), or the build may be killed.
If the api container restarts with exit code 137 (out of memory), raise `mem_limit` to `448m` in `docker-compose.yml`.

## 1. Server setup (Ubuntu, once)
```bash
# Docker + compose plugin
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-v2 nginx git
sudo usermod -aG docker $USER && newgrp docker

# 2 GB swap so the build fits in 1 GB RAM
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
Security group: open port **80** (and 22 for SSH). Do **not** open 3000 or 8080.

## 2. Get the code
```bash
git clone https://github.com/SaswatHanRiver/student-hw2.git
cd student-hw2
```
(Or from your PC: `scp -r student-hw2 ubuntu@<ec2-ip>:~/` — leave out `frontend/node_modules`.)

## 3. Build and start both containers
```bash
cp .env.example .env              # check FRONTEND_URL and API_URL
docker compose up -d --build      # first build: about 5 to 10 minutes on a micro instance
docker compose ps                 # both "Up"; api becomes "healthy" after about 1 minute
curl -s localhost:8101/actuator/health        # {"status":"UP"}
curl -s "localhost:8101/api/v1/students?size=1"
curl -s -o /dev/null -w "%{http_code}\n" localhost:3101/students/list   # 200
```

## 4. nginx
```bash
sudo cp deploy/nginx/student-hw2.conf /etc/nginx/sites-available/student-hw2
sudo ln -sf /etc/nginx/sites-available/student-hw2 /etc/nginx/sites-enabled/student-hw2
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```
Open `https://students-hw.dvconsulting.org/students/list` (after the DNS records exist). API check: `https://students-hw-api.dvconsulting.org/actuator/health`.

## 5. Update after a new push
```bash
cd ~/student-hw2 && git pull
docker compose up -d --build
docker image prune -f && docker builder prune -f   # free disk space from old builds
```

## 6. Check memory
```bash
docker stats --no-stream
```
Paste the MEM USAGE column into the build report.

## Notes
- H2 is in memory: data resets to the 24 seed students whenever the api container restarts.
- Logs: `docker compose logs -f api` / `docker compose logs -f web`
- Stop: `docker compose down`
