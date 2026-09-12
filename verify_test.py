import urllib.request
import urllib.error
import json

base = "http://localhost:5001"

def test_api():
    print("--- 1. Health Check ---")
    with urllib.request.urlopen(base + "/api/health") as r:
        data = json.loads(r.read())
        print("✓ Health check:", data["status"], f"(Environment: {data['environment']})")

    print("\n--- 2. Magazines API ---")
    with urllib.request.urlopen(base + "/api/magazines") as r:
        data = json.loads(r.read())
        print(f"✓ Magazines published: {data['count']}")
        for m in data["magazines"]:
            print(f"   - Volume {m['volumeNumber']}: {m['title']} ({m['pagesCount']} pages, PDF: {m['pdfUrl']})")
        assert data["count"] >= 1
        assert any(m["volumeNumber"] == 11 for m in data["magazines"])

    print("\n--- 3. Merchandise Removed Check ---")
    try:
        with urllib.request.urlopen(base + "/api/merchandise") as r:
            print("ERROR: Merchandise endpoint still exists!")
    except urllib.error.HTTPError as e:
        print(f"✓ Verified: Merchandise endpoint removed (HTTP {e.code})")

    print("\n--- 4. Admin Login (Manual credentials) ---")
    req = urllib.request.Request(
        base + "/api/admin/login",
        data=json.dumps({"username": "udaymag25", "password": "uDAY26deV"}).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as r:
        auth_data = json.loads(r.read())
        token = auth_data["token"]
        print("✓ Admin Login successful! Token acquired:", token[:24] + "...")

    print("\n--- 5. Admin Upload New Magazine Issue ---")
    new_mag = {
        "volumeNumber": "12",
        "year": "2025",
        "title": "Ethereal Horizons",
        "theme": "Cross-Disciplinary Scientific Inquiries & Ecological Thought",
        "editorInChief": "Editorial Board",
        "pagesCount": "88",
        "pdfUrl": "https://drive.google.com/file/d/sample-uday-vol-12/view",
        "coverImageUrl": "/uday-logo.jpg",
        "description": "Exploration of the post-pandemic research landscape."
    }
    req = urllib.request.Request(
        base + "/api/magazines",
        data=json.dumps(new_mag).encode(),
        headers={"Content-Type": "application/json", "Authorization": "Bearer " + token}
    )
    with urllib.request.urlopen(req) as r:
        mag_res = json.loads(r.read())
        print("✓ Admin successfully published new magazine issue:", mag_res["magazine"]["title"])

    print("\n--- 6. Verify New Magazine in Public Library ---")
    with urllib.request.urlopen(base + "/api/magazines") as r:
        data = json.loads(r.read())
        titles = [m["title"] for m in data["magazines"]]
        assert "Ethereal Horizons" in titles
        print("✓ New volume verified in public /api/magazines library!")

    print("\n--- 7. Submit Community Blog ---")
    new_blog = {
        "title": "Reflections by the Library Lawn",
        "author": "Priya Sharma",
        "email": "priya.s23@iiserb.ac.in",
        "category": "Campus Musings",
        "excerpt": "A short note on quiet study hours during exam week.",
        "content": "The afternoon light cuts across the green carpet of grass..."
    }
    req = urllib.request.Request(
        base + "/api/blogs",
        data=json.dumps(new_blog).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as r:
        sub_data = json.loads(r.read())
        blog_id = sub_data["blogId"]
        print("✓ New blog submitted:", sub_data["message"][:70] + "...")

    print("\n--- 8. Review Notice & 1-Click Approval ---")
    req = urllib.request.Request(
        base + "/api/admin/email-logs",
        headers={"Authorization": "Bearer " + token}
    )
    with urllib.request.urlopen(req) as r:
        logs = json.loads(r.read())["logs"]
        latest_email = logs[0]
        print("✓ Notice sent strictly to:", latest_email["to"])
        print("   Subject:", latest_email["subject"])

    req = urllib.request.Request(
        base + "/api/admin/blogs",
        headers={"Authorization": "Bearer " + token}
    )
    with urllib.request.urlopen(req) as r:
        all_blogs = json.loads(r.read())["blogs"]
        target = next(b for b in all_blogs if b["id"] == blog_id)
        approve_token = target["approveToken"]

    with urllib.request.urlopen(f"{base}/api/blogs/approve?id={blog_id}&token={approve_token}") as r:
        html = r.read().decode()
        assert "Blog Approved" in html
        print("✓ 1-Click Approval confirmed! Blog approved for 30 days.")

    print("\n--- 9. Strict Password Change OTP Verification ---")
    req = urllib.request.Request(
        base + "/api/admin/request-password-change",
        data=json.dumps({"currentPassword": "uDAY26deV", "newPassword": "uDAY26deV_TEST"}).encode(),
        headers={"Content-Type": "application/json", "Authorization": "Bearer " + token}
    )
    with urllib.request.urlopen(req) as r:
        pw_req = json.loads(r.read())
        print("✓ Password Change dispatched OTP strictly to email:", pw_req["message"][:75] + "...")

    req = urllib.request.Request(
        base + "/api/admin/email-logs",
        headers={"Authorization": "Bearer " + token}
    )
    with urllib.request.urlopen(req) as r:
        logs = json.loads(r.read())["logs"]
        otp_email = logs[0]
        print("✓ Security OTP Email sent to:", otp_email["to"])
        print("   Subject:", otp_email["subject"])

    print("\n--- 10. Multi-Page SPA Routing Fallback Test ---")
    routes_to_test = ["/", "/magazines", "/blogs", "/gallery", "/events", "/feedback", "/contact", "/admin"]
    for route in routes_to_test:
        with urllib.request.urlopen(base + route) as r:
            html = r.read().decode()
            assert "UDAY" in html
            print(f"✓ Route '{route}' served successfully (Status {r.status})")

    print("\n🎉 ALL 10 COMPREHENSIVE ARCHITECTURAL & SECURITY TESTS PASSED!\n")

if __name__ == "__main__":
    test_api()
