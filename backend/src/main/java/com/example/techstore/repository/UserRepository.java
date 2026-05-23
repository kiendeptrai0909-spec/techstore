package com.example.techstore.repository;

import com.example.techstore.entity.User;
import com.example.techstore.enums.UserRole;
import com.example.techstore.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    Page<User> findByRole(UserRole role, Pageable pageable);

    Page<User> findByStatus(UserStatus status, Pageable pageable);

    Page<User> findByRoleAndStatus(UserRole role, UserStatus status, Pageable pageable);

    long countByRole(UserRole role);

    long countByStatus(UserStatus status);

    @Query("""
            select u
            from User u
            where u.role = :role
              and u.deletedAt is null
              and (:keyword = ''
                   or lower(u.fullName) like concat('%', :keyword, '%')
                   or lower(u.email) like concat('%', :keyword, '%')
                   or lower(coalesce(u.phone, '')) like concat('%', :keyword, '%'))
              and (:status is null or u.status = :status)
            order by u.id desc
            """)
    Page<User> searchAdminCustomers(
            @Param("role") UserRole role,
            @Param("keyword") String keyword,
            @Param("status") UserStatus status,
            Pageable pageable
    );

    @Query("""
            select u
            from User u
            where u.deletedAt is null
              and u.role in :roles
              and (:role is null or u.role = :role)
              and (:keyword = ''
                   or lower(u.fullName) like concat('%', :keyword, '%')
                   or lower(u.email) like concat('%', :keyword, '%')
                   or lower(coalesce(u.phone, '')) like concat('%', :keyword, '%'))
              and (:status is null or u.status = :status)
            order by u.id desc
            """)
    Page<User> searchAdminEmployees(
            @Param("roles") List<UserRole> roles,
            @Param("role") UserRole role,
            @Param("keyword") String keyword,
            @Param("status") UserStatus status,
            Pageable pageable
    );
}