<?php
require_once __DIR__ . '/../config/database.php';

class HostelModel {
    private $db;

    public function __construct() {
        $this->db = getDBConnection();
    }

    public function getAllApproved($filters = []) {
        $sql = "SELECT h.*, 
                    GROUP_CONCAT(DISTINCT hi.image_path ORDER BY hi.is_primary DESC SEPARATOR '|') as images,
                    f.wifi, f.laundry, f.mess, f.parking, f.cctv, f.security_guard, f.generator
                FROM hostels h
                LEFT JOIN hostel_images hi ON h.id = hi.hostel_id
                LEFT JOIN facilities f ON h.id = f.hostel_id
                WHERE h.status = 'approved'";
        
        $params = [];
        
        if (!empty($filters['city'])) {
            $sql .= " AND h.city LIKE ?";
            $params[] = '%' . $filters['city'] . '%';
        }
        if (!empty($filters['area'])) {
            $sql .= " AND h.area LIKE ?";
            $params[] = '%' . $filters['area'] . '%';
        }
        if (!empty($filters['university'])) {
            $sql .= " AND h.nearby_university LIKE ?";
            $params[] = '%' . $filters['university'] . '%';
        }
        if (!empty($filters['hostel_type'])) {
            $sql .= " AND h.hostel_type = ?";
            $params[] = $filters['hostel_type'];
        }
        if (!empty($filters['min_rent'])) {
            $sql .= " AND h.rent >= ?";
            $params[] = $filters['min_rent'];
        }
        if (!empty($filters['max_rent'])) {
            $sql .= " AND h.rent <= ?";
            $params[] = $filters['max_rent'];
        }
        if (!empty($filters['rating'])) {
            $sql .= " AND h.rating >= ?";
            $params[] = $filters['rating'];
        }
        
        $sql .= " GROUP BY h.id ORDER BY h.rating DESC, h.created_at DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll();
        
        foreach ($results as &$row) {
            $row['images'] = $row['images'] ? explode('|', $row['images']) : [];
        }
        
        return $results;
    }

    public function getFeatured($limit = 6) {
        $sql = "SELECT h.*, 
                    (SELECT hi.image_path FROM hostel_images hi WHERE hi.hostel_id = h.id AND hi.is_primary = 1 LIMIT 1) as primary_image,
                    f.wifi, f.laundry, f.mess, f.parking, f.cctv, f.security_guard, f.generator
                FROM hostels h
                LEFT JOIN facilities f ON h.id = f.hostel_id
                WHERE h.status = 'approved'
                ORDER BY h.rating DESC, h.total_reviews DESC
                LIMIT ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$limit]);
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $sql = "SELECT h.*, 
                    GROUP_CONCAT(DISTINCT hi.image_path ORDER BY hi.is_primary DESC SEPARATOR '|') as images,
                    f.wifi, f.laundry, f.mess, f.parking, f.cctv, f.security_guard, f.generator
                FROM hostels h
                LEFT JOIN hostel_images hi ON h.id = hi.hostel_id
                LEFT JOIN facilities f ON h.id = f.hostel_id
                WHERE h.id = ? AND h.status = 'approved'
                GROUP BY h.id";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $hostel = $stmt->fetch();
        
        if ($hostel) {
            $hostel['images'] = $hostel['images'] ? explode('|', $hostel['images']) : [];
        }
        
        return $hostel;
    }

    public function create($data) {
        $sql = "INSERT INTO hostels (hostel_name, owner_name, phone, whatsapp, city, area, address, nearby_university, rent, security_fee, description, hostel_type, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['hostel_name'],
            $data['owner_name'],
            $data['phone'],
            $data['whatsapp'] ?? $data['phone'],
            $data['city'],
            $data['area'] ?? '',
            $data['address'],
            $data['nearby_university'] ?? '',
            $data['rent'],
            $data['security_fee'] ?? 0,
            $data['description'] ?? '',
            $data['hostel_type']
        ]);
        
        return $this->db->lastInsertId();
    }

    public function addFacilities($hostelId, $facilities) {
        $sql = "INSERT INTO facilities (hostel_id, wifi, laundry, mess, parking, cctv, security_guard, generator)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                wifi=VALUES(wifi), laundry=VALUES(laundry), mess=VALUES(mess),
                parking=VALUES(parking), cctv=VALUES(cctv), security_guard=VALUES(security_guard),
                generator=VALUES(generator)";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $hostelId,
            $facilities['wifi'] ? 1 : 0,
            $facilities['laundry'] ? 1 : 0,
            $facilities['mess'] ? 1 : 0,
            $facilities['parking'] ? 1 : 0,
            $facilities['cctv'] ? 1 : 0,
            $facilities['security_guard'] ? 1 : 0,
            $facilities['generator'] ? 1 : 0,
        ]);
    }

    public function addImage($hostelId, $imagePath, $isPrimary = false) {
        $sql = "INSERT INTO hostel_images (hostel_id, image_path, is_primary) VALUES (?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$hostelId, $imagePath, $isPrimary ? 1 : 0]);
    }

    // Admin methods
    public function getAllForAdmin() {
        $sql = "SELECT h.*, 
                    (SELECT hi.image_path FROM hostel_images hi WHERE hi.hostel_id = h.id AND hi.is_primary = 1 LIMIT 1) as primary_image
                FROM hostels h
                ORDER BY h.created_at DESC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll();
    }

    public function updateStatus($id, $status) {
        $stmt = $this->db->prepare("UPDATE hostels SET status = ? WHERE id = ?");
        return $stmt->execute([$status, $id]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM hostels WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function getStats() {
        $stats = [];
        
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM hostels");
        $stats['total'] = $stmt->fetch()['total'];
        
        $stmt = $this->db->query("SELECT COUNT(*) as pending FROM hostels WHERE status = 'pending'");
        $stats['pending'] = $stmt->fetch()['pending'];
        
        $stmt = $this->db->query("SELECT COUNT(*) as approved FROM hostels WHERE status = 'approved'");
        $stats['approved'] = $stmt->fetch()['approved'];
        
        $stmt = $this->db->query("SELECT COUNT(DISTINCT city) as cities FROM hostels WHERE status = 'approved'");
        $stats['cities'] = $stmt->fetch()['cities'];
        
        return $stats;
    }
}
