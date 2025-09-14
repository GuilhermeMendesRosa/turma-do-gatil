package br.com.udesc.turma_do_gatil_back.repositories.impl;

import br.com.udesc.turma_do_gatil_back.entities.QCat;
import br.com.udesc.turma_do_gatil_back.entities.QSterilization;
import br.com.udesc.turma_do_gatil_back.entities.Sterilization;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import br.com.udesc.turma_do_gatil_back.repositories.SterilizationRepositoryCustom;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class SterilizationRepositoryImpl implements SterilizationRepositoryCustom {

    @Autowired
    private JPAQueryFactory queryFactory;

    private final QSterilization qSterilization = QSterilization.sterilization;
    private final QCat qCat = QCat.cat;

    @Override
    public Page<Sterilization> findAllWithCat(Pageable pageable) {
        JPAQuery<Sterilization> query = queryFactory.selectFrom(qSterilization)
                .join(qSterilization.cat(), qCat).fetchJoin()
                .orderBy(qSterilization.sterilizationDate.desc());

        long total = query.fetchCount();

        List<Sterilization> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Optional<Sterilization> findByIdWithCat(UUID id) {
        Sterilization sterilization = queryFactory.selectFrom(qSterilization)
                .join(qSterilization.cat(), qCat).fetchJoin()
                .where(qSterilization.id.eq(id))
                .fetchOne();

        return Optional.ofNullable(sterilization);
    }

    @Override
    public Page<Sterilization> findByCatIdWithCat(UUID catId, Pageable pageable) {
        JPAQuery<Sterilization> query = queryFactory.selectFrom(qSterilization)
                .join(qSterilization.cat(), qCat).fetchJoin()
                .where(qSterilization.catId.eq(catId))
                .orderBy(qSterilization.sterilizationDate.desc());

        long total = query.fetchCount();

        List<Sterilization> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Sterilization> findByStatusWithCat(SterilizationStatus status, Pageable pageable) {
        JPAQuery<Sterilization> query = queryFactory.selectFrom(qSterilization)
                .join(qSterilization.cat(), qCat).fetchJoin()
                .where(qSterilization.status.eq(status))
                .orderBy(qSterilization.sterilizationDate.desc());

        long total = query.fetchCount();

        List<Sterilization> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Sterilization> findBySterilizationDateBetweenWithCat(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        JPAQuery<Sterilization> query = queryFactory.selectFrom(qSterilization)
                .join(qSterilization.cat(), qCat).fetchJoin()
                .where(qSterilization.sterilizationDate.between(startDate, endDate))
                .orderBy(qSterilization.sterilizationDate.desc());

        long total = query.fetchCount();

        List<Sterilization> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Sterilization> findWithFilters(UUID catId, SterilizationStatus status,
                                               LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        BooleanBuilder predicate = new BooleanBuilder();

        if (catId != null) {
            predicate.and(qSterilization.catId.eq(catId));
        }

        if (status != null) {
            predicate.and(qSterilization.status.eq(status));
        }

        if (startDate != null) {
            predicate.and(qSterilization.sterilizationDate.goe(startDate));
        }

        if (endDate != null) {
            predicate.and(qSterilization.sterilizationDate.loe(endDate));
        }

        JPAQuery<Sterilization> query = queryFactory.selectFrom(qSterilization)
                .join(qSterilization.cat(), qCat).fetchJoin()
                .where(predicate)
                .orderBy(qSterilization.sterilizationDate.desc());

        long total = query.fetchCount();

        List<Sterilization> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Sterilization> findByCatId(UUID catId, Pageable pageable) {
        return findByCatIdWithCat(catId, pageable);
    }

    @Override
    public Page<Sterilization> findByStatus(SterilizationStatus status, Pageable pageable) {
        return findByStatusWithCat(status, pageable);
    }

    @Override
    public Page<Sterilization> findBySterilizationDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return findBySterilizationDateBetweenWithCat(startDate, endDate, pageable);
    }

    @Override
    public long countByStatus(SterilizationStatus status) {
        return queryFactory.selectFrom(qSterilization)
                .where(qSterilization.status.eq(status))
                .fetchCount();
    }
}
